import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Server Component / Server Action / Route Handler için Supabase client.
 * Server Component'te yazma yapılamadığı için set/remove no-op olabilir;
 * gerçek yazma işlemleri Server Action veya Route Handler'da yapılır.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }: { name: string; value: string; options?: any }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component'te set çağrıldığında hata olabilir, görmezden gel.
          }
        },
      },
    }
  );
}
