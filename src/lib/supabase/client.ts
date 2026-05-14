'use client';

import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Eski kodla uyumluluk için: import { supabase } from '@/lib/supabase'
// Eski kod `supabase.from(...)` çağırıyor; bu singleton client component'lerde çalışır.
// Server component'lerde @/lib/supabase/server kullan.
export const supabase = createClient();
