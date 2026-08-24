import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// No R2/KV incremental cache — traffic is low enough that per-isolate
// in-memory (non-persistent) caching is sufficient, and it avoids requiring
// R2 (needs a card on file) or KV for a marketplace this size.
export default defineCloudflareConfig({});
