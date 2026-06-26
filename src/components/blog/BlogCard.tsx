'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { BlogPost } from '../../types/database';
import { useT } from '../../hooks/useT';
import { useTranslation } from '../../hooks/useTranslation';
import Image from 'next/image';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop';

const READ_MORE: Record<string, string> = {
  tr: 'Devamını Oku', en: 'Read More', de: 'Weiterlesen', fr: 'Lire la suite',
  es: 'Leer más', pt: 'Ler mais', it: 'Leggi di più', pl: 'Czytaj więcej',
  nl: 'Lees meer', ru: 'Читать далее', uk: 'Читати далі', zh: '阅读更多',
  ja: '続きを読む', hi: 'और पढ़ें', ar: 'اقرأ المزيد', fa: 'بیشتر بخوانید',
  ko: '더 읽기', vi: 'Đọc thêm', id: 'Baca selengkapnya', bn: 'আরো পড়ুন',
};

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  const t = useT();
  const { locale } = useTranslation();
  const [imgSrc, setImgSrc] = useState(post.cover_image || FALLBACK_IMAGE);

  const formattedDate = useMemo(() => {
    if (!post?.created_at) return '';
    return new Date(post.created_at).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }, [post?.created_at]);

  const cleanExcerpt = useMemo(() => {
    if (post.excerpt) return post.excerpt;
    if (!post.content) return '';
    
    // Markdown karakterlerini temizle: linkler, kalın metinler, başlıklar vb.
    return post.content
      .replace(/!\[.*?\]\(.*?\)/g, '') // Resimleri kaldır
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Linkleri metne çevir
      .replace(/[#*`]/g, '') // Markdown işaretlerini kaldır
      .substring(0, 150)
      .trim() + '...';
  }, [post.excerpt, post.content]);

  return (
    <Link 
      href={`/${post.language || 'en'}/blog/${post.slug}`}
      className={`group block overflow-hidden rounded-2xl ${t.card} ${t.cardHover}`}
    >
      {/* Image */}
      <div className="aspect-[16/9] overflow-hidden relative">
        <Image
          src={imgSrc}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          unoptimized={true}
          onError={() => setImgSrc(FALLBACK_IMAGE)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-4 mb-3 text-xs text-muted/60">
          <div className="flex items-center gap-1.5" suppressHydrationWarning>
            <Calendar size={14} className="text-accent" />
            {formattedDate}
          </div>
          {post.author && (
            <div className="flex items-center gap-1.5">
              <User size={14} className="text-accent" />
              {post.author.full_name}
            </div>
          )}
        </div>

        <h3 className={`text-lg font-bold ${t.heading} mb-2 group-hover:text-accent transition-colors line-clamp-2`}>
          {post.title}
        </h3>
        
        <p className={`text-sm ${t.sub} line-clamp-3 mb-4`}>
          {cleanExcerpt}
        </p>

        <div className="flex items-center gap-2 text-accent text-sm font-bold">
          {READ_MORE[locale] ?? 'Read More'}
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
