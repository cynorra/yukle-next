import type { Metadata } from 'next';
import { createPublicClient } from '@/lib/supabase/public';
import { PublicProfilePageClient } from './PublicProfilePageClient';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://loadlyapp.com';

export const revalidate = 600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from('public_profiles')
      .select('full_name, company_name, role, rating')
      .eq('id', id)
      .maybeSingle();

    if (!data) {
      return {
        title: 'Kullanıcı Bulunamadı',
        robots: { index: false, follow: false },
      };
    }

    const name = data.company_name || data.full_name || 'Kullanıcı';
    const role = data.role === 'driver' ? 'Nakliyeci' : 'Yük Sahibi';

    return {
      title: `${name} - ${role}`,
      description: `${name} (${role}) profili. Puan: ${data.rating || 0}. YükLe üzerinde nakliye ilanları.`,
      alternates: { canonical: `/kullanici/${id}` },
      openGraph: {
        title: `${name} - YükLe ${role}`,
        url: `${SITE_URL}/kullanici/${id}`,
      },
    };
  } catch {
    return {
      title: 'Kullanıcı Profili',
      robots: { index: false, follow: false },
    };
  }
}

export default function Page() {
  return <PublicProfilePageClient />;
}
