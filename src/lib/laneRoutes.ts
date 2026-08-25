/**
 * Route hub pages — durable, evergreen pages derived from active loads that
 * don't disappear or go noindex just because one specific load completes:
 *
 * - Lane hubs: origin→destination city pair (e.g. /shipping-routes/phoenix-az-to-tucson-az)
 * - City hubs: single origin city, any destination (e.g. /shipping-routes/from/phoenix-az)
 * - Country hubs: single origin country, any destination (e.g. /shipping-routes/country/usa)
 *
 * City/country hubs exist to catch broader, higher-volume search queries
 * ("loads from Texas", "freight shipping Germany") that a specific two-city
 * lane slug is too narrow to match.
 *
 * All three are derived data (not DB tables): grouped in-memory from the same
 * batch of active loads. Scoped to the most recent 5,000 active loads —
 * plenty for current site scale and bounds the cost of the full-table scan
 * as load volume grows.
 */

import { createPublicClient } from '@/lib/supabase/public';

export interface LoadRow {
  id: string;
  title: string | null;
  title_translations: Record<string, string> | null;
  origin_city: string | null;
  origin_country: string | null;
  destination_city: string | null;
  destination_country: string | null;
  weight_ton: number | null;
  created_at: string | null;
  required_truck_type: string | null;
  load_type: string | null;
}

export interface Lane {
  slug: string;
  originCity: string;
  originCountry: string;
  destinationCity: string;
  destinationCountry: string;
  loads: LoadRow[];
}

export interface CityHub {
  slug: string;
  city: string;
  country: string;
  loads: LoadRow[];
}

export interface CountryHub {
  slug: string;
  country: string;
  loads: LoadRow[];
}

export interface TruckTypeHub {
  slug: string;
  truckType: string;
  loads: LoadRow[];
}

export interface LoadTypeHub {
  slug: string;
  loadType: string;
  loads: LoadRow[];
}

// Was 5000 (5 sequential 1000-row DB round-trips + grouping over 5000 rows) —
// cut to 1000 (a single round-trip) because that computation alone regularly
// exceeded the Workers Free plan's 10ms CPU-time cap on a cold isolate,
// intermittently failing/hanging sitemap-routes. The most recent 1000 active
// loads is still plenty to represent current lane/city/country hub coverage.
const MAX_SCANNED_LOADS = 1000;

export function slugifyCity(text: string): string {
  if (!text) return 'location';
  const trMap: Record<string, string> = {
    'ı': 'i', 'İ': 'i', 'ğ': 'g', 'Ğ': 'g', 'ü': 'u', 'Ü': 'u',
    'ş': 's', 'Ş': 's', 'ö': 'o', 'Ö': 'o', 'ç': 'c', 'Ç': 'c'
  };
  let str = text;
  for (const [key, val] of Object.entries(trMap)) {
    str = str.replaceAll(key, val);
  }
  const clean = str
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return clean || 'location';
}

// `origin_country`/`destination_country` come from three different sources
// (a geocoding autocomplete for user-created loads, plus two independent
// scrapers) that don't agree on language — verified against production data
// on 2026-08-10: the same country shows up under both its English name and a
// Turkish one (e.g. "United Arab Emirates" / "BAE" / "Birlesik Arap
// Emirligi", "Slovakia" / "Slovakya", "Denmark" / "Danimarka"). Left
// unnormalized, that fragments one country's loads across 2-3 separate hub
// pages instead of one strong page. Canonicalize to English before slugging
// or displaying — doesn't touch the DB, just how hub pages group.
const COUNTRY_NAME_ALIASES: Record<string, string> = {
  'slovakya': 'Slovakia',
  'slovenya': 'Slovenia',
  'bae': 'United Arab Emirates',
  'birlesik arap emirligi': 'United Arab Emirates',
  'tunus': 'Tunisia',
  'katar': 'Qatar',
  'danimarka': 'Denmark',
  'kuveyt': 'Kuwait',
  'arnavutluk': 'Albania',
  'kosova': 'Kosovo',
  'nijer': 'Niger',
  'iskocya': 'United Kingdom',
  'urdun': 'Jordan',
  'makedonya': 'North Macedonia',
};

export function normalizeCountryName(country: string): string {
  const canonical = COUNTRY_NAME_ALIASES[country.trim().toLowerCase()];
  return canonical ?? country;
}

// Country included so same-named cities in different countries (e.g. two
// "Springfield"s or "Alexandria"s) don't collapse into one lane page.
export function buildLaneSlug(originCity: string, originCountry: string, destinationCity: string, destinationCountry: string): string {
  return `${slugifyCity(originCity)}-${slugifyCity(normalizeCountryName(originCountry))}-to-${slugifyCity(destinationCity)}-${slugifyCity(normalizeCountryName(destinationCountry))}`;
}

export function buildCitySlug(city: string, country: string): string {
  return `${slugifyCity(city)}-${slugifyCity(normalizeCountryName(country))}`;
}

export function buildCountrySlug(country: string): string {
  return slugifyCity(normalizeCountryName(country));
}

export function buildTruckTypeSlug(truckType: string): string {
  return slugifyCity(truckType);
}

export function buildLoadTypeSlug(loadType: string): string {
  return slugifyCity(loadType);
}

// `next start` runs as one long-lived process (WEB_CONCURRENCY=1 in prod), so
// a module-level cache actually persists across requests. Seven hub types
// now each independently call fetchRecentActiveLoads() on first visit to a
// given slug — a crawl burst across many freshly-added hub URLs (e.g. right
// after a sitemap expansion) previously meant that many concurrent full
// 5000-row scans + Map builds stacking up in memory at once, which is what
// drove the production OOM crash. Collapsing same-process requests within a
// short window into one shared fetch caps that peak.
const LOADS_CACHE_TTL_MS = 60_000;
let loadsCache: { data: LoadRow[]; fetchedAt: number } | null = null;
let loadsCacheInFlight: Promise<LoadRow[]> | null = null;

/**
 * Fetch the most recent active loads once. Shared by lane/city/country
 * grouping so callers that need more than one grouping (e.g. the sitemap)
 * don't pay for the scan three times, and cached briefly across requests so
 * a burst of hits doesn't multiply the DB scan + in-memory grouping cost.
 */
export async function fetchRecentActiveLoads(): Promise<LoadRow[]> {
  if (loadsCache && Date.now() - loadsCache.fetchedAt < LOADS_CACHE_TTL_MS) {
    return loadsCache.data;
  }
  if (loadsCacheInFlight) {
    return loadsCacheInFlight;
  }

  loadsCacheInFlight = (async () => {
    const supabase = createPublicClient();
    const allLoads: LoadRow[] = [];

    let from = 0;
    const step = 1000;

    while (from < MAX_SCANNED_LOADS) {
      const to = Math.min(from + step - 1, MAX_SCANNED_LOADS - 1);
      const { data: loads, error } = await supabase
        .from('loads')
        .select('id, title, title_translations, origin_city, origin_country, destination_city, destination_country, weight_ton, created_at, required_truck_type, load_type')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error || !loads || loads.length === 0) break;

      allLoads.push(...(loads as LoadRow[]));

      if (loads.length < step) break;
      from += step;
    }

    loadsCache = { data: allLoads, fetchedAt: Date.now() };
    loadsCacheInFlight = null;
    return allLoads;
  })();

  return loadsCacheInFlight;
}

export function groupByLane(loads: LoadRow[]): Map<string, Lane> {
  const lanes = new Map<string, Lane>();
  for (const load of loads) {
    if (!load.origin_city || !load.origin_country || !load.destination_city || !load.destination_country) continue;
    const slug = buildLaneSlug(load.origin_city, load.origin_country, load.destination_city, load.destination_country);
    const existing = lanes.get(slug);
    if (existing) {
      existing.loads.push(load);
    } else {
      lanes.set(slug, {
        slug,
        originCity: load.origin_city,
        originCountry: normalizeCountryName(load.origin_country),
        destinationCity: load.destination_city,
        destinationCountry: normalizeCountryName(load.destination_country),
        loads: [load],
      });
    }
  }
  return lanes;
}

export function groupByCity(loads: LoadRow[]): Map<string, CityHub> {
  const hubs = new Map<string, CityHub>();
  for (const load of loads) {
    if (!load.origin_city || !load.origin_country) continue;
    const slug = buildCitySlug(load.origin_city, load.origin_country);
    const existing = hubs.get(slug);
    if (existing) {
      existing.loads.push(load);
    } else {
      hubs.set(slug, { slug, city: load.origin_city, country: normalizeCountryName(load.origin_country), loads: [load] });
    }
  }
  return hubs;
}

export function groupByCountry(loads: LoadRow[]): Map<string, CountryHub> {
  const hubs = new Map<string, CountryHub>();
  for (const load of loads) {
    if (!load.origin_country) continue;
    const slug = buildCountrySlug(load.origin_country);
    const existing = hubs.get(slug);
    if (existing) {
      existing.loads.push(load);
    } else {
      hubs.set(slug, { slug, country: normalizeCountryName(load.origin_country), loads: [load] });
    }
  }
  return hubs;
}

// Destination-side mirrors of groupByCity/groupByCountry — same CityHub/CountryHub
// shape, just keyed off destination_city/destination_country instead of origin.
// Serves "loads TO this city/country" queries that the origin-only hubs miss.
export function groupByDestinationCity(loads: LoadRow[]): Map<string, CityHub> {
  const hubs = new Map<string, CityHub>();
  for (const load of loads) {
    if (!load.destination_city || !load.destination_country) continue;
    const slug = buildCitySlug(load.destination_city, load.destination_country);
    const existing = hubs.get(slug);
    if (existing) {
      existing.loads.push(load);
    } else {
      hubs.set(slug, { slug, city: load.destination_city, country: normalizeCountryName(load.destination_country), loads: [load] });
    }
  }
  return hubs;
}

export function groupByDestinationCountry(loads: LoadRow[]): Map<string, CountryHub> {
  const hubs = new Map<string, CountryHub>();
  for (const load of loads) {
    if (!load.destination_country) continue;
    const slug = buildCountrySlug(load.destination_country);
    const existing = hubs.get(slug);
    if (existing) {
      existing.loads.push(load);
    } else {
      hubs.set(slug, { slug, country: normalizeCountryName(load.destination_country), loads: [load] });
    }
  }
  return hubs;
}

export function groupByTruckType(loads: LoadRow[]): Map<string, TruckTypeHub> {
  const hubs = new Map<string, TruckTypeHub>();
  for (const load of loads) {
    if (!load.required_truck_type) continue;
    const slug = buildTruckTypeSlug(load.required_truck_type);
    const existing = hubs.get(slug);
    if (existing) {
      existing.loads.push(load);
    } else {
      hubs.set(slug, { slug, truckType: load.required_truck_type, loads: [load] });
    }
  }
  return hubs;
}

export function groupByLoadType(loads: LoadRow[]): Map<string, LoadTypeHub> {
  const hubs = new Map<string, LoadTypeHub>();
  for (const load of loads) {
    if (!load.load_type) continue;
    const slug = buildLoadTypeSlug(load.load_type);
    const existing = hubs.get(slug);
    if (existing) {
      existing.loads.push(load);
    } else {
      hubs.set(slug, { slug, loadType: load.load_type, loads: [load] });
    }
  }
  return hubs;
}

export async function getActiveLanes(): Promise<Map<string, Lane>> {
  return groupByLane(await fetchRecentActiveLoads());
}

export async function getLane(slug: string): Promise<Lane | null> {
  const lanes = await getActiveLanes();
  return lanes.get(slug) ?? null;
}

export async function getActiveCityHubs(): Promise<Map<string, CityHub>> {
  return groupByCity(await fetchRecentActiveLoads());
}

export async function getCityHub(slug: string): Promise<CityHub | null> {
  const hubs = await getActiveCityHubs();
  return hubs.get(slug) ?? null;
}

export async function getActiveCountryHubs(): Promise<Map<string, CountryHub>> {
  return groupByCountry(await fetchRecentActiveLoads());
}

export async function getCountryHub(slug: string): Promise<CountryHub | null> {
  const hubs = await getActiveCountryHubs();
  return hubs.get(slug) ?? null;
}

export async function getActiveDestinationCityHubs(): Promise<Map<string, CityHub>> {
  return groupByDestinationCity(await fetchRecentActiveLoads());
}

export async function getDestinationCityHub(slug: string): Promise<CityHub | null> {
  const hubs = await getActiveDestinationCityHubs();
  return hubs.get(slug) ?? null;
}

export async function getActiveDestinationCountryHubs(): Promise<Map<string, CountryHub>> {
  return groupByDestinationCountry(await fetchRecentActiveLoads());
}

export async function getDestinationCountryHub(slug: string): Promise<CountryHub | null> {
  const hubs = await getActiveDestinationCountryHubs();
  return hubs.get(slug) ?? null;
}

export async function getActiveTruckTypeHubs(): Promise<Map<string, TruckTypeHub>> {
  return groupByTruckType(await fetchRecentActiveLoads());
}

export async function getTruckTypeHub(slug: string): Promise<TruckTypeHub | null> {
  const hubs = await getActiveTruckTypeHubs();
  return hubs.get(slug) ?? null;
}

export async function getActiveLoadTypeHubs(): Promise<Map<string, LoadTypeHub>> {
  return groupByLoadType(await fetchRecentActiveLoads());
}

export async function getLoadTypeHub(slug: string): Promise<LoadTypeHub | null> {
  const hubs = await getActiveLoadTypeHubs();
  return hubs.get(slug) ?? null;
}

/**
 * All groupings in a genuine single pass over `loads` — for the sitemap,
 * which needs every hub type without scanning the loads table once per type.
 * (Previously called the 7 groupBy* helpers separately, i.e. 7 full passes
 * over up to MAX_SCANNED_LOADS rows — on a cold Workers isolate that
 * regularly blew the Workers Free plan's 10ms CPU-time cap and made
 * sitemap-routes intermittently fail/hang. This does the same grouping
 * logic as groupByLane/groupByCity/etc., just in one loop.)
 */
interface RouteHubs {
  lanes: Map<string, Lane>;
  cities: Map<string, CityHub>;
  countries: Map<string, CountryHub>;
  destinationCities: Map<string, CityHub>;
  destinationCountries: Map<string, CountryHub>;
  truckTypes: Map<string, TruckTypeHub>;
  loadTypes: Map<string, LoadTypeHub>;
}

// Same pattern as loadsCache above, one level up: sitemap.xml and
// sitemap-routes/[page] both need the full 7-way grouping (not just one
// hub's worth like getLane/getCityHub/etc. do), and were each recomputing
// it independently on every cold render — genuinely CPU-bound work (slug
// building + Map inserts over up to 1000 rows), not just DB latency, so it
// was still hitting the Workers Free plan's CPU cap even after the DB scan
// itself got cheaper. Caching the computed Maps lets same-isolate callers
// within the window share one computation instead of each paying it fresh.
const ROUTE_HUBS_CACHE_TTL_MS = 60_000;
let routeHubsCache: { data: RouteHubs; fetchedAt: number } | null = null;
let routeHubsCacheInFlight: Promise<RouteHubs> | null = null;

export async function getAllRouteHubs(): Promise<RouteHubs> {
  if (routeHubsCache && Date.now() - routeHubsCache.fetchedAt < ROUTE_HUBS_CACHE_TTL_MS) {
    return routeHubsCache.data;
  }
  if (routeHubsCacheInFlight) {
    return routeHubsCacheInFlight;
  }

  routeHubsCacheInFlight = computeAllRouteHubs().then((result) => {
    routeHubsCache = { data: result, fetchedAt: Date.now() };
    routeHubsCacheInFlight = null;
    return result;
  });

  return routeHubsCacheInFlight;
}

async function computeAllRouteHubs(): Promise<RouteHubs> {
  const loads = await fetchRecentActiveLoads();

  const lanes = new Map<string, Lane>();
  const cities = new Map<string, CityHub>();
  const countries = new Map<string, CountryHub>();
  const destinationCities = new Map<string, CityHub>();
  const destinationCountries = new Map<string, CountryHub>();
  const truckTypes = new Map<string, TruckTypeHub>();
  const loadTypes = new Map<string, LoadTypeHub>();

  for (const load of loads) {
    if (load.origin_city && load.origin_country && load.destination_city && load.destination_country) {
      const slug = buildLaneSlug(load.origin_city, load.origin_country, load.destination_city, load.destination_country);
      const existing = lanes.get(slug);
      if (existing) existing.loads.push(load);
      else lanes.set(slug, {
        slug,
        originCity: load.origin_city,
        originCountry: normalizeCountryName(load.origin_country),
        destinationCity: load.destination_city,
        destinationCountry: normalizeCountryName(load.destination_country),
        loads: [load],
      });
    }

    if (load.origin_city && load.origin_country) {
      const slug = buildCitySlug(load.origin_city, load.origin_country);
      const existing = cities.get(slug);
      if (existing) existing.loads.push(load);
      else cities.set(slug, { slug, city: load.origin_city, country: normalizeCountryName(load.origin_country), loads: [load] });
    }

    if (load.origin_country) {
      const slug = buildCountrySlug(load.origin_country);
      const existing = countries.get(slug);
      if (existing) existing.loads.push(load);
      else countries.set(slug, { slug, country: normalizeCountryName(load.origin_country), loads: [load] });
    }

    if (load.destination_city && load.destination_country) {
      const slug = buildCitySlug(load.destination_city, load.destination_country);
      const existing = destinationCities.get(slug);
      if (existing) existing.loads.push(load);
      else destinationCities.set(slug, { slug, city: load.destination_city, country: normalizeCountryName(load.destination_country), loads: [load] });
    }

    if (load.destination_country) {
      const slug = buildCountrySlug(load.destination_country);
      const existing = destinationCountries.get(slug);
      if (existing) existing.loads.push(load);
      else destinationCountries.set(slug, { slug, country: normalizeCountryName(load.destination_country), loads: [load] });
    }

    if (load.required_truck_type) {
      const slug = buildTruckTypeSlug(load.required_truck_type);
      const existing = truckTypes.get(slug);
      if (existing) existing.loads.push(load);
      else truckTypes.set(slug, { slug, truckType: load.required_truck_type, loads: [load] });
    }

    if (load.load_type) {
      const slug = buildLoadTypeSlug(load.load_type);
      const existing = loadTypes.get(slug);
      if (existing) existing.loads.push(load);
      else loadTypes.set(slug, { slug, loadType: load.load_type, loads: [load] });
    }
  }

  return { lanes, cities, countries, destinationCities, destinationCountries, truckTypes, loadTypes };
}
