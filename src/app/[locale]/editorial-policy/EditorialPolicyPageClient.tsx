'use client';

import { useT } from '@/hooks/useT';
import { useParams } from 'next/navigation';
import { FileText } from 'lucide-react';

interface Copy {
  title: string;
  description: string;
  s1Title: string; s1Body: string;
  s2Title: string; s2Body: string; s2L1: string; s2L2: string; s2L3: string; s2L4: string;
  s3Title: string; s3Body: string;
  s4Title: string; s4Body: string;
  s5Title: string; s5Body: string;
  contactTitle: string; contactBody: string;
}

const COPY: Record<string, Copy> = {
  en: {
    title: 'Editorial Policy',
    description: 'How Loadly produces, checks, and publishes its blog content.',
    s1Title: 'Who writes this',
    s1Body: "Loadly's blog is run by a single-person editorial operation (Eren Şimşir, also the site's founder), not an anonymous \"content team.\" Every published article is attributed to a real, named person, not a generic brand byline.",
    s2Title: 'How articles are produced',
    s2Body: "Most articles are drafted with AI assistance (Google Gemini) under a detailed set of editorial rules, then published automatically once they pass a set of automated checks. Those checks include:",
    s2L1: "A similarity check against recently published articles — anything too close to existing content is rejected before publishing, not merged after the fact.",
    s2L2: "A sourcing rule: any specific statistic must either come from a real, verifiable body (e.g. FMCSA, IRU, IATA, Eurostat) or be presented as a realistic range with no invented precision — never a fabricated number dressed up as fact.",
    s2L3: "A block on fabricated first-person or hands-on-testing claims (e.g. \"we tested\", \"in my years as a dispatcher, I've seen\") — Loadly's blog is not a hands-on product-testing publication, and never claims to be.",
    s2L4: "A block on citations attributed to organizations that aren't real, verifiable bodies.",
    s3Title: 'What we do not do',
    s3Body: "We do not fabricate credentials, invented statistics, fake customer testimonials, or claim hands-on testing that never happened. If a claim can't be backed by something real, it's written as general industry context instead of a precise, sourced fact.",
    s4Title: 'Corrections',
    s4Body: "If you spot a factual error, an outdated figure, or a broken source reference in any article, we want to know and will correct it.",
    s5Title: 'Publishing cadence',
    s5Body: "Loadly publishes on a modest, weekday-only cadence rather than a high-volume automated schedule, deliberately keeping output at a pace a small editorial operation can realistically stand behind.",
    contactTitle: 'Contact',
    contactBody: 'For corrections, questions, or feedback about any article:',
  },
  tr: {
    title: 'Editoryal Politika',
    description: "Loadly blog içeriğini nasıl üretir, kontrol eder ve yayınlar.",
    s1Title: 'Bunu kim yazıyor',
    s1Body: "Loadly blogu, anonim bir \"içerik ekibi\" değil, tek kişilik bir editoryal operasyon tarafından yürütülür (Eren Şimşir, aynı zamanda sitenin kurucusu). Yayınlanan her makale jenerik bir marka imzası yerine gerçek, isimli bir kişiye atfedilir.",
    s2Title: 'Makaleler nasıl üretiliyor',
    s2Body: "Makalelerin çoğu, detaylı editoryal kurallar altında yapay zeka desteğiyle (Google Gemini) hazırlanır ve bir dizi otomatik kontrolden geçtikten sonra otomatik olarak yayınlanır. Bu kontroller şunları içerir:",
    s2L1: "Yakın zamanda yayınlanmış makalelerle benzerlik kontrolü — mevcut içeriğe çok yakın olan hiçbir şey, sonradan birleştirilmek yerine yayınlanmadan önce reddedilir.",
    s2L2: "Kaynak kuralı: herhangi bir kesin istatistik ya gerçek, doğrulanabilir bir kurumdan (ör. FMCSA, IRU, IATA, Eurostat) gelmeli ya da uydurma bir kesinlik olmadan gerçekçi bir aralık olarak sunulmalı — asla gerçekmiş gibi gösterilen uydurma bir rakam olmamalı.",
    s2L3: "Uydurma birinci-şahıs veya elle-test iddialarına karşı engel (ör. \"biz test ettik\", \"yıllarca dispatcher olarak çalıştığım süreçte gördüm\") — Loadly blogu elle ürün testi yapan bir yayın değildir ve asla öyle olduğunu iddia etmez.",
    s2L4: "Gerçek, doğrulanabilir olmayan kurumlara atfedilen alıntılara karşı engel.",
    s3Title: 'Yapmadıklarımız',
    s3Body: "Uydurma unvanlar, uydurma istatistikler, sahte müşteri yorumları üretmeyiz veya hiç yapılmamış elle test iddiasında bulunmayız. Bir iddia gerçek bir şeyle desteklenemiyorsa, kesin ve kaynaklı bir gerçek yerine genel sektör bilgisi olarak yazılır.",
    s4Title: 'Düzeltmeler',
    s4Body: "Herhangi bir makalede gerçek dışı bir bilgi, güncelliğini yitirmiş bir rakam veya bozuk bir kaynak referansı görürseniz, bunu bilmek ve düzeltmek isteriz.",
    s5Title: 'Yayın sıklığı',
    s5Body: "Loadly, yüksek hacimli otomatik bir yayın takviminden ziyade, mütevazı ve sadece hafta içi bir sıklıkla yayın yapar — çıktıyı bilinçli olarak küçük bir editoryal operasyonun gerçekçi şekilde arkasında durabileceği bir tempoda tutuyoruz.",
    contactTitle: 'İletişim',
    contactBody: 'Herhangi bir makaleyle ilgili düzeltme, soru veya geri bildirim için:',
  },
};

export function EditorialPolicyPageClient({ locale }: { locale: string }) {
  const t = useT();
  const params = useParams();
  const activeLocale = (typeof params?.locale === 'string' ? params.locale : locale) || 'en';
  const c = COPY[activeLocale] || COPY.en;

  return (
    <div className={t.pageFull}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className={`text-2xl font-bold ${t.heading} flex items-center gap-3`}>
            <FileText size={28} className="text-[#A66700]" />
            {c.title}
          </h1>
          <p className={`text-sm ${t.muted} mt-1`}>{c.description}</p>
        </div>

        <div className={`p-6 rounded-2xl ${t.card} mb-4`}>
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>{c.s1Title}</h2>
          <p className={`text-sm ${t.sub} leading-relaxed`}>{c.s1Body}</p>
        </div>

        <div className={`p-6 rounded-2xl ${t.card} mb-4`}>
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>{c.s2Title}</h2>
          <p className={`text-sm ${t.sub} leading-relaxed mb-3`}>{c.s2Body}</p>
          <ul className={`list-disc list-inside space-y-2 text-sm ${t.sub}`}>
            <li>{c.s2L1}</li>
            <li>{c.s2L2}</li>
            <li>{c.s2L3}</li>
            <li>{c.s2L4}</li>
          </ul>
        </div>

        <div className={`p-6 rounded-2xl ${t.card} mb-4`}>
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>{c.s3Title}</h2>
          <p className={`text-sm ${t.sub} leading-relaxed`}>{c.s3Body}</p>
        </div>

        <div className={`p-6 rounded-2xl ${t.card} mb-4`}>
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>{c.s5Title}</h2>
          <p className={`text-sm ${t.sub} leading-relaxed`}>{c.s5Body}</p>
        </div>

        <div className={`p-6 rounded-2xl ${t.card} mb-4`}>
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>{c.s4Title}</h2>
          <p className={`text-sm ${t.sub} leading-relaxed`}>{c.s4Body}</p>
        </div>

        <div className={`p-6 rounded-2xl ${t.card} mb-4`}>
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>{c.contactTitle}</h2>
          <p className={`text-sm ${t.sub} leading-relaxed`}>
            {c.contactBody}{' '}
            <a href="mailto:info@loadlyapp.com" className="text-[#A66700] hover:underline">info@loadlyapp.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
