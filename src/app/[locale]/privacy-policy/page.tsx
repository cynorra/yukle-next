import type { Metadata } from 'next';
import { KVKKPageClient } from './KVKKPageClient';
import { TRANSLATIONS } from '@/utils/translations';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://loadlyapp.com';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale } = await params;

  const titles: Record<string, string> = {
    tr: 'KVKK Aydınlatma Metni | Loadly',
    en: 'GDPR Privacy Policy | Loadly',
    de: 'DSGVO Datenschutzerklärung | Loadly',
    fr: 'Politique de confidentialité RGPD | Loadly',
    es: 'Política de privacidad RGPD | Loadly',
    pt: 'Política de privacidade RGPD | Loadly',
    it: 'Informativa sulla privacy GDPR | Loadly',
    pl: 'Polityka prywatności RODO | Loadly',
    nl: 'AVG Privacybeleid | Loadly',
    ru: 'Политика конфиденциальности | Loadly',
  };

  const descs: Record<string, string> = {
    tr: 'Loadly platformu KVKK kişisel verilerin korunması aydınlatma metni. 6698 sayılı Kanun kapsamında haklarınız ve veri işleme politikamız.',
    en: 'Loadly platform GDPR privacy policy. Your rights and data processing policy under General Data Protection Regulation.',
    de: 'Loadly Plattform DSGVO Datenschutzerklärung. Ihre Rechte und Datenschutzrichtlinien.',
    fr: 'Politique de confidentialité RGPD de la plateforme Loadly. Vos droits et notre politique de traitement des données.',
    es: 'Política de privacidad RGPD de la plataforma Loadly. Sus derechos y nuestra política de procesamiento de datos.',
  };

  const title = titles[rawLocale] ?? `Privacy Policy | Loadly`;
  const description = descs[rawLocale] ?? 'Loadly platform privacy policy and GDPR/KVKK compliance information.';

  const languagesAlternates: Record<string, string> = { 'x-default': `${SITE_URL}/en/privacy-policy` };
  (Object.keys(TRANSLATIONS) as string[]).forEach((loc) => {
    languagesAlternates[loc] = `${SITE_URL}/${loc}/privacy-policy`;
  });

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${rawLocale}/privacy-policy`,
      languages: languagesAlternates,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${rawLocale}/privacy-policy`,
    },
  };
}

export default function Page() {
  return <KVKKPageClient />;
}
