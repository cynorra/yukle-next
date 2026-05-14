import { createClient as createSupabase } from '@supabase/supabase-js';

/**
 * Cookie kullanmayan, auth bağlamı içermeyen Supabase client.
 * Public/anonim okuma için (sitemap, public ilan listeleri, blog, vb.) ideal.
 * Bu sayede sayfa SSG/ISR ile prerender edilebilir.
 *
 * NOT: Bu client RLS (Row Level Security) kurallarına anonim olarak tabi olur.
 * Yalnızca public okuma yapılabilir.
 */
export function createPublicClient() {
  return createSupabase(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}
