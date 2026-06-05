'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { BlogPost } from '@/types/database';
import { useT } from '@/hooks/useT';
import { useTranslation } from '@/hooks/useTranslation';
import { BLOG_TRANSLATIONS } from '@/utils/blogTranslations';
import type { Locale } from '@/utils/translations';
import { 
  Calendar, 
  User as UserIcon, 
  ChevronLeft, 
  Clock,
  Loader2,
  Facebook,
  Twitter,
  MessageCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

export function BlogDetailClient() {
  const { slug } = useParams();
  const router = useRouter();
  const t = useT();
  const { locale } = useTranslation();
  const activeLocale = (locale in BLOG_TRANSLATIONS) ? (locale as Locale) : 'en';
  const tr = BLOG_TRANSLATIONS[activeLocale];
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scroll Progress Logic
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    async function fetchPost() {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*, author:profiles(full_name)')
          .eq('slug', slug)
          .eq('published', true)
          .single();

        if (error) throw error;
        setPost(data);
      } catch (err) {
        console.error('Error fetching post:', err);
        router.push('/blog');
      } finally {
        setLoading(false);
      }
    }

    if (slug) fetchPost();
  }, [slug, router]);

  const faqJsonLd = useMemo(() => {
    if (slug === 'kamyon-tir-soforleri-yuk-bulma-rehberi') {
      return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Kamyon ve tır şoförleri en hızlı nasıl yük bulur?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "En hızlı yöntem; güzergah bazlı ilanları düzenli kontrol etmek, dönüş yükü fırsatlarını takip etmek, parça yük ilanlarını değerlendirmek ve ilan detaylarını (araç tipi/tonaj/tarih) filtreleyerek iletişime hızlı geçmektir."
            }
          },
          {
            "@type": "Question",
            "name": "Dönüş yükü nedir, nasıl bulunur?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Dönüş yükü, aracın teslimat sonrası boş dönmemesi için dönüş güzergahında alınan yüktür. Dönüş yükü bulmak için dönüş rotanıza uygun ilanları arayın, tarih aralığını netleştirin ve varış noktasına yakın çıkışlı ilanlara öncelik verin."
            }
          },
          {
            "@type": "Question",
            "name": "Parça yük taşımacılığı kimler için uygundur?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Parça yük, tam araç doldurmayan yüklerdir. Özellikle kamyonet ve minivan gibi araçlarla çalışan taşıyıcılar için uygundur; aynı güzergâhta birden fazla küçük yük birleştirilerek verim artırılabilir."
            }
          },
          {
            "@type": "Question",
            "name": "Yük ilanında hangi bilgiler olmalı?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "İlanda çıkış/varış şehir-ilçe, yükleme tarihi, yük cinsi, ağırlık/tonaj veya hacim, istenen araç tipi (kamyon/tır/kamyonet), palet/adet bilgisi, özel şartlar ve net iletişim bilgileri yer almalıdır."
            }
          },
          {
            "@type": "Question",
            "name": "Nakliyeci seçerken nelere dikkat edilmeli?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yetki ve evraklar, sigorta/taşıma şartları, daha önceki iş geçmişi/yorumlar, fiyatın neleri kapsadığı ve teslim süresi gibi kriterler mutlaka netleştirilmelidir."
            }
          }
        ]
      };
    }
    return undefined;
  }, [slug]);

  // Calculate Reading Time
  const readingTime = useMemo(() => {
    if (!post?.content) return 0;
    const wordsPerMinute = 200;
    const words = post.content.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  }, [post?.content]);

  // Formatted Date
  const formattedDate = useMemo(() => {
    if (!post?.created_at) return '';
    const formatLocale = locale === 'tr' ? 'tr-TR' : (locale === 'en' ? 'en-US' : locale);
    return new Date(post.created_at).toLocaleDateString(formatLocale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }, [post?.created_at, locale]);

  // Enhanced Markdown Parser with Link Support
  const renderedContent = useMemo(() => {
    if (!post?.content) return null;

    const renderInline = (text: string) => {
      // Handle Links: [text](url)
      const parts = text.split(/(\[.+?\]\(.+?\))/g);
      
      return parts.map((part, i) => {
        // Link match
        const linkMatch = part.match(/\[(.+?)\]\((.+?)\)/);
        if (linkMatch) {
          return (
            <a 
              key={i} 
              href={linkMatch[2]} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-accent hover:underline font-bold"
            >
              {linkMatch[1]}
            </a>
          );
        }

        // Bold match
        const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
        return boldParts.map((bPart, bi) => {
          if (bPart.startsWith('**') && bPart.endsWith('**')) {
            return <strong key={`${i}-${bi}`} className="font-black text-accent">{bPart.slice(2, -2)}</strong>;
          }
          return bPart;
        });
      });
    };

    const lines = post.content
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .split('\n');

    let paragraphCount = 0;
    const elements: JSX.Element[] = [];

    lines.forEach((rawLine, index) => {
      const line = rawLine.trimEnd();

      // H4 (####)
      const h4 = line.match(/^#{4}\s+(.*)/);
      if (h4) {
        elements.push(<h4 key={index} className="text-lg font-bold mt-6 mb-3 text-fg">{renderInline(h4[1])}</h4>);
        return;
      }

      // H3 (###)
      const h3 = line.match(/^#{3}\s+(.*)/);
      if (h3) {
        elements.push(<h3 key={index} className="text-xl font-bold mt-8 mb-4 text-fg">{renderInline(h3[1])}</h3>);
        return;
      }

      // H2 (##)
      const h2 = line.match(/^#{2}\s+(.*)/);
      if (h2) {
        elements.push(<h2 key={index} className="text-2xl font-black mt-12 mb-6 text-fg border-l-4 border-accent pl-4">{renderInline(h2[1])}</h2>);
        return;
      }

      // H1 (#)
      const h1 = line.match(/^#\s+(.*)/);
      if (h1) {
        elements.push(<h1 key={index} className="text-3xl font-black mt-14 mb-6 text-fg">{renderInline(h1[1])}</h1>);
        return;
      }

      // Resim: ![alt](url)
      const imageMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)/);
      if (imageMatch) {
        elements.push(
          <div key={index} className="my-8 rounded-2xl overflow-hidden shadow-lg border border-border-light dark:border-border-dark">
            <img
              src={imageMatch[2]}
              alt={imageMatch[1]}
              className="w-full h-auto object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            {imageMatch[1] && (
              <p className={`text-sm text-center py-2 px-4 ${t.muted} italic`}>{imageMatch[1]}</p>
            )}
          </div>
        );
        return;
      }

      // Numaralı liste (1. ...)
      const numbered = line.match(/^(\d+)\.\s+(.*)/);
      if (numbered) {
        elements.push(
          <div key={index} className="flex gap-3 ml-2 md:ml-6 group mb-4">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 text-accent text-xs font-bold flex items-center justify-center mt-1 group-hover:bg-accent group-hover:text-white transition-colors">
              {numbered[1]}
            </span>
            <p className={`text-lg ${t.body}`}>{renderInline(numbered[2])}</p>
          </div>
        );
        return;
      }

      // Madde işaretli liste (* veya -)
      const bullet = line.match(/^[* -]\s+(.*)/);
      if (bullet) {
        elements.push(
          <div key={index} className="flex gap-3 ml-2 md:ml-6 group mb-4">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 text-accent text-xs font-bold flex items-center justify-center mt-1 group-hover:bg-accent group-hover:text-white transition-colors">
              •
            </span>
            <p className={`text-lg ${t.body}`}>{renderInline(bullet[1])}</p>
          </div>
        );
        return;
      }

      // Boş satır
      if (line.trim() === '') {
        elements.push(<div key={index} className="h-4" />);
        return;
      }

      // Normal paragraf
      elements.push(<p key={index} className={`text-lg leading-relaxed mb-6 ${t.body}`}>{renderInline(line)}</p>);
      paragraphCount++;

      // Inject keyword-led subsections for specific articles
      if (slug === 'kamyon-tir-soforleri-yuk-bulma-rehberi' && paragraphCount === 6) {
        elements.push(
          <div key="extra-sections-yuk-bulma">
            <h2 className="text-2xl font-black mt-12 mb-6 text-fg border-l-4 border-accent pl-4">Güzergah Bazlı Yük Bulma Stratejileri</h2>
            <p className={`text-lg leading-relaxed mb-6 ${t.body}`}>
              Sadece mevcut konumunuzda yük aramak yerine, varış noktanızdan geri dönüş rotası üzerindeki şehirleri de kapsayan bir arama yapmalısınız. 
              Loadly'nin akıllı eşleştirme algoritması, boş araçlarınız için en verimli güzergahı hesaplayarak ara duraklardaki yükleri de karşınıza çıkarır.
            </p>
            <h2 className="text-2xl font-black mt-12 mb-6 text-fg border-l-4 border-accent pl-4">Araç Tipine Göre En Uygun Yükü Seçmek</h2>
            <p className={`text-lg leading-relaxed mb-6 ${t.body}`}>
              TIR, kamyon veya kamyonet fark etmeksizin; aracınızın tonaj ve hacim kapasitesini tam dolduracak yükleri seçmek birim maliyetinizi düşürür. 
              Özellikle kamyonetler için <strong>parça yük</strong> (LTL) taşımacılığı, boş kapasiteyi değerlendirmek için en ideal yöntemdir.
            </p>
          </div>
        );
      }

      if (slug === 'sehirler-arasi-nakliye-maliyet-dusurme' && paragraphCount === 6) {
        elements.push(
          <div key="extra-sections-maliyet">
            <h2 className="text-2xl font-black mt-12 mb-6 text-fg border-l-4 border-accent pl-4">Parça Yük ile Nakliye Maliyetini %50 Azaltın</h2>
            <p className={`text-lg leading-relaxed mb-6 ${t.body}`}>
              Komple araç kiralamak yerine <strong>parça yük</strong> seçeneğini değerlendirmek, küçük hacimli gönderiler için en büyük tasarruf kalemidir. 
              Aynı güzergaha giden diğer yüklerle araç paylaşımı yaparak nakliye masraflarınızı minimize edebilirsiniz.
            </p>
            <h2 className="text-2xl font-black mt-12 mb-6 text-fg border-l-4 border-accent pl-4">Dönüş Yükü (Backhaul) Fırsatlarını Yakalayın</h2>
            <p className={`text-lg leading-relaxed mb-6 ${t.body}`}>
              Nakliyecilerin boş dönmemek için sunduğu <strong>dönüş yükü</strong> fiyatları, standart tarifelere göre çok daha uygundur. 
              Örneğin, İstanbul'dan İzmir'e giden bir aracın dönüş seferini yakalamak, şehirler arası nakliyede ciddi bir bütçe avantajı sağlar.
            </p>
            <div className="bg-accent/5 p-6 rounded-2xl border border-accent/10 mb-8">
              <h4 className="font-bold mb-2">Pratik Örnek:</h4>
              <p className="text-sm italic">"Geçen ay Ankara-Antalya hattında komple araç yerine parça yük tercih eden bir üyemiz, nakliye maliyetini 12.000 TL'den 5.500 TL'ye düşürmeyi başardı."</p>
            </div>
          </div>
        );
      }

      // Inject CTA after first 2-3 paragraphs
      if (paragraphCount === 3) {
        let ctaText = '';
        const ctaLink = '/pazar';
        let anchorText = '';

        if (slug === 'sehirler-arasi-nakliye-maliyet-dusurme') {
          ctaText = 'Nakliye maliyetlerinizi düşürmek için Loadly pazarını kullanın.';
          anchorText = 'şehirler arası nakliye için yük ilanları';
        } else if (slug === 'kamyon-tir-soforleri-yuk-bulma-rehberi') {
          ctaText = 'Hemen yük bulmak ve kazancınızı artırmak için pazar sayfamızı ziyaret edin.';
          anchorText = 'güzergah bazlı yük ilanları';
        } else if (slug === 'evden-eve-nakliyat-yasal-mevzuat-belgeler') {
          ctaText = 'Yasal mevzuata uygun güvenilir taşıyıcıları Loadly platformunda bulun.';
          anchorText = 'nakliye ilanları ve taşıyıcı bulma';
        }

        if (ctaText) {
          elements.push(
            <div key="cta-block" className="my-10 p-8 rounded-3xl bg-accent/5 border border-accent/20">
              <p className="text-lg font-bold mb-4">{ctaText}</p>
              <div className="flex flex-wrap gap-4">
                <Link href={ctaLink} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-bold hover:shadow-lg hover:shadow-accent/20 transition-all">
                  {anchorText}
                </Link>
                <Link href="/kayit" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-surface-dark border border-accent/20 text-accent font-bold hover:bg-accent/5 transition-all">
                  ücretsiz kayıt
                </Link>
              </div>
            </div>
          );
        }
      }
    });

    // Inject FAQ section at the end
    if (slug === 'kamyon-tir-soforleri-yuk-bulma-rehberi') {
      elements.push(
        <div key="faq-section" className="mt-16 pt-12 border-t border-border-light dark:border-border-dark">
          <h2 className="text-3xl font-black mb-8 text-fg">Sık Sorulan Sorular</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-3 text-fg">Kamyon ve tır şoförleri en hızlı nasıl yük bulur?</h3>
              <p className={`text-lg ${t.body}`}>En hızlı yöntem; güzergah bazlı ilanları düzenli kontrol etmek, dönüş yükü fırsatlarını takip etmek, parça yük ilanları değerlendirmek ve ilan detaylarını (araç tipi/tonaj/tarih) filtreleyerek iletişime hızlı geçmektir.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3 text-fg">Dönüş yükü nedir, nasıl bulunur?</h3>
              <p className={`text-lg ${t.body}`}>Dönüş yükü, aracın teslimat sonrası boş dönmemesi için dönüş güzergahında alınan yüktür. Dönüş yükü bulmak için dönüş rotanıza uygun ilanları arayın, tarih aralığını netleştirin ve varış noktasına yakın çıkışlı ilanlara öncelik verin.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3 text-fg">Parça yük taşımacılığı kimler için uygundur?</h3>
              <p className={`text-lg ${t.body}`}>Parça yük, tam araç doldurmayan yüklerdir. Özellikle kamyonet ve minivan gibi araçlarla çalışan taşıyıcılar için uygundur; aynı güzergâhta birden fazla küçük yük birleştirilerek verim artırılabilir.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3 text-fg">Yük ilanında hangi bilgiler olmalı?</h3>
              <p className={`text-lg ${t.body}`}>İlanda çıkış/varış şehir-ilçe, yükleme tarihi, yük cinsi, ağırlık/tonaj veya hacim, istenen araç tipi (kamyon/tır/kamyonet), palet/adet bilgisi, özel şartlar ve net iletişim bilgileri yer almalıdır.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3 text-fg">Nakliyeci seçerken nelere dikkat edilmeli?</h3>
              <p className={`text-lg ${t.body}`}>Yetki ve evraklar, sigorta/taşıma şartları, daha önceki iş geçmişi/yorumlar, fiyatın neleri kapsadığı ve teslim süresi gibi kriterler mutlaka netleştirilmelidir.</p>
            </div>
          </div>
        </div>
      );
    }

    // Inject Cross-links section
    if (slug === 'kamyon-tir-soforleri-yuk-bulma-rehberi' || slug === 'sehirler-arasi-nakliye-maliyet-dusurme') {
      elements.push(
        <div key="cross-links" className="mt-16 pt-12 border-t border-border-light dark:border-border-dark">
          <h2 className="text-2xl font-black mb-6 text-fg">İlgili içerikler</h2>
          <ul className="space-y-4">
            {slug === 'kamyon-tir-soforleri-yuk-bulma-rehberi' && (
              <li>
                <Link href="/blog/sehirler-arasi-nakliye-maliyet-dusurme" className="text-lg font-bold text-accent hover:underline">
                  şehirler arası nakliyede maliyet düşürme yöntemleri
                </Link>
              </li>
            )}
            {slug === 'sehirler-arasi-nakliye-maliyet-dusurme' && (
              <li>
                <Link href="/blog/kamyon-tir-soforleri-yuk-bulma-rehberi" className="text-lg font-bold text-accent hover:underline">
                  kamyon ve tır şoförleri için yük bulma rehberi
                </Link>
              </li>
            )}
          </ul>
        </div>
      );
    }

    return elements;
  }, [post?.content, slug, t.muted, t.body]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 size={48} className="text-accent animate-spin mb-4" />
        <p className={t.muted}>{tr.loading}</p>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className={t.pageFull}>
      {/* Progress Bar */}
      <div className="fixed top-20 left-0 z-50 w-full h-1 bg-accent/5">
        <motion.div 
          className="h-full bg-accent shadow-[0_0_10px_rgba(var(--accent-rgb),0.5)]" 
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Back Button */}
        <Link 
          href="/blog"
          className="inline-flex items-center gap-2 text-muted hover:text-accent mb-8 transition-colors group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          {tr.backToBlog}
        </Link>

        {/* Hero Section */}
        <header className="mb-12 text-center">
          <div className="flex items-center justify-center gap-4 mb-6 text-sm">
            <div className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full ${t.card} border-accent/20 text-accent font-bold`}>
              <Calendar size={14} />
              {formattedDate}
            </div>
            <div className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full ${t.card} border-accent/20 text-accent font-bold`}>
              <Clock size={14} />
              {tr.readingTime ? tr.readingTime + ' ' : ''}{readingTime} {tr.readingTimeSuffix}
            </div>
          </div>

          <h1 className={`text-4xl md:text-6xl font-black ${t.heading} mb-8 leading-tight tracking-tight`}>
            {post.title}
          </h1>

          <div className="flex items-center justify-center gap-6 py-8 border-y border-border-light dark:border-border-dark mb-12">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent border border-accent/20">
                <UserIcon size={24} />
              </div>
              <div className="text-left">
                <div className={`text-sm font-bold ${t.heading}`}>{post.author?.full_name || (locale === 'tr' ? 'YükLe Editör' : 'Loadly Editor')}</div>
                <div className={`text-xs ${t.muted}`}>{tr.authorRole}</div>
              </div>
            </div>

            <div className="h-10 w-[1px] bg-border-light dark:bg-border-dark hidden md:block" />

            <div className="flex items-center gap-2">
              <button 
                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                className={`p-2.5 rounded-xl ${t.btnSecondary} hover:text-accent transition-all`}
              >
                <Facebook size={20} />
              </button>
              <button 
                onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`, '_blank')}
                className={`p-2.5 rounded-xl ${t.btnSecondary} hover:text-accent transition-all`}
              >
                <Twitter size={20} />
              </button>
              <button 
                onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(post.title + ' ' + window.location.href)}`, '_blank')}
                className={`p-2.5 rounded-xl ${t.btnSecondary} hover:text-accent transition-all`}
              >
                <MessageCircle size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Cover Image */}
        <div className="relative group mb-16">
          <div className="absolute -inset-4 bg-accent/5 rounded-[40px] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative rounded-[32px] overflow-hidden shadow-2xl border border-border-light dark:border-border-dark aspect-[21/10]">
            <img 
              src={post.cover_image || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop'} 
              alt={post.title}
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>

        {/* AdSense Placeholder - Top */}
        <div className="w-full h-24 bg-surface-light dark:bg-surface-dark border border-dashed border-border-light dark:border-border-dark rounded-2xl flex items-center justify-center mb-12">
          <div className="text-center text-xs font-bold text-muted/60">{locale === 'tr' ? 'Google AdSense - Görüntülü Reklam' : 'Google AdSense - Display Ad'}</div>
        </div>

        {/* Content */}
        <article className={`max-w-none mb-16 ${t.heading}`}>
          <div className="leading-relaxed text-lg">
            {renderedContent}
          </div>
        </article>

        {/* AdSense Placeholder - Bottom */}
        <div className="w-full h-64 bg-surface-light dark:bg-surface-dark border border-dashed border-border-light dark:border-border-dark rounded-3xl flex items-center justify-center mb-16">
          <div className="text-center text-xs font-bold text-muted/60">{locale === 'tr' ? 'Google AdSense - İçerik İçi Reklam' : 'Google AdSense - In-Article Ad'}</div>
        </div>

        {/* Footer Info */}
        <div className="p-8 rounded-3xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark mb-12">
          <h3 className={`text-xl font-bold ${t.heading} mb-4`}>{tr.shareTitle}</h3>
          <p className={`text-sm ${t.sub} mb-6`}>
            {tr.shareDesc}
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
              className={`flex-1 py-3 rounded-xl bg-[#1877F2] text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity`}
            >
              <Facebook size={20} /> Facebook
            </button>
            <button 
              onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`, '_blank')}
              className={`flex-1 py-3 rounded-xl bg-[#1DA1F2] text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity`}
            >
              <Twitter size={20} /> Twitter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
