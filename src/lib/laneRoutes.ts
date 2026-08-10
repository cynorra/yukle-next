/**
 * "Lane" hub pages — durable, evergreen pages per origin→destination city pair
 * (e.g. /en/shipping-routes/phoenix-az-to-tucson-az) that list currently active
 * loads on that lane. Unlike an individual /marketplace/[id] page, a lane page
 * doesn't disappear or go noindex just because one specific load completes —
 * it just shows whatever is currently active on that route.
 *
 * Lanes are derived data (not a DB table): grouped in-memory from active loads.
 * Scoped to the most recent 5,000 active loads — plenty for current site scale
 * and bounds the cost of the full-table scan as load volume grows.
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

/**
 * Fetch the most recent active loads and group them into lanes.
 * Shared by the lane page (to find one lane's loads) and the lane sitemap
 * (to enumerate every currently-indexable lane).
 */
export async function getActiveLanes(): Promise<Map<string, Lane>> {
  const supabase = createPublicClient();
  const lanes = new Map<string, Lane>();

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

    for (const load of loads as LoadRow[]) {
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

    if (loads.length < step) break;
    from += step;
  }

  return lanes;
}

export async function getLane(slug: string): Promise<Lane | null> {
  const lanes = await getActiveLanes();
  return lanes.get(slug) ?? null;
}
