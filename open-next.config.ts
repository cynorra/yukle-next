import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Tried Workers KV as the incremental cache (see git history) to fix
// intermittent cold-isolate CPU-limit failures on sitemap chunks — reverted
// because populating it requires ~1000+ KV writes per deploy, which alone
// exhausts the Workers Free plan's 1000-writes/day cap and starves live ISR
// revalidation writes for the rest of the day, on every deploy. Not viable
// at this scale without the paid plan. Back to per-isolate in-memory
// (non-persistent) caching; the underlying cold-isolate CPU risk on
// sitemap-blogs/[page] remains and is accepted for now (low-traffic,
// crawler-only route).
export default defineCloudflareConfig({});
