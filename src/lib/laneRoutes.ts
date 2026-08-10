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

const MAX_SCANNED_LOADS = 5000;

export function slugifyCity(city: string): string {
  return city
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip diacritics
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Country included so same-named cities in different countries (e.g. two
// "Springfield"s or "Alexandria"s) don't collapse into one lane page.
export function buildLaneSlug(originCity: string, originCountry: string, destinationCity: string, destinationCountry: string): string {
  return `${slugifyCity(originCity)}-${slugifyCity(originCountry)}-to-${slugifyCity(destinationCity)}-${slugifyCity(destinationCountry)}`;
}

export function buildCitySlug(city: string, country: string): string {
  return `${slugifyCity(city)}-${slugifyCity(country)}`;
}

export function buildCountrySlug(country: string): string {
  return slugifyCity(country);
}

/**
 * Fetch the most recent active loads once. Shared by lane/city/country
 * grouping so callers that need more than one grouping (e.g. the sitemap)
 * don't pay for the scan three times.
 */
export async function fetchRecentActiveLoads(): Promise<LoadRow[]> {
  const supabase = createPublicClient();
  const allLoads: LoadRow[] = [];

  let from = 0;
  const step = 1000;

  while (from < MAX_SCANNED_LOADS) {
    const to = Math.min(from + step - 1, MAX_SCANNED_LOADS - 1);
    const { data: loads, error } = await supabase
      .from('loads')
      .select('id, title, title_translations, origin_city, origin_country, destination_city, destination_country, weight_ton, created_at')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error || !loads || loads.length === 0) break;

    allLoads.push(...(loads as LoadRow[]));

    if (loads.length < step) break;
    from += step;
  }

  return allLoads;
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
        originCountry: load.origin_country,
        destinationCity: load.destination_city,
        destinationCountry: load.destination_country,
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
      hubs.set(slug, { slug, city: load.origin_city, country: load.origin_country, loads: [load] });
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
      hubs.set(slug, { slug, country: load.origin_country, loads: [load] });
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

/**
 * All three groupings in one pass — for the sitemap, which needs to
 * enumerate every hub type without scanning the loads table three times.
 */
export async function getAllRouteHubs(): Promise<{ lanes: Map<string, Lane>; cities: Map<string, CityHub>; countries: Map<string, CountryHub> }> {
  const loads = await fetchRecentActiveLoads();
  return {
    lanes: groupByLane(loads),
    cities: groupByCity(loads),
    countries: groupByCountry(loads),
  };
}
