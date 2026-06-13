'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import BlogCard from '@/components/blog/BlogCard';
import type { BlogPost } from '@/types/database';
import { useTranslation } from '@/hooks/useTranslation';
import { BLOG_TRANSLATIONS } from '@/utils/blogTranslations';
import type { Locale } from '@/utils/translations';
import { motion } from 'framer-motion';

interface Props {
  posts: BlogPost[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export function BlogListClient({ posts }: Props) {
  const [search, setSearch] = useState('');
  const { locale } = useTranslation();
  const activeLocale = (locale in BLOG_TRANSLATIONS) ? (locale as Locale) : 'en';
  const t = BLOG_TRANSLATIONS[activeLocale];

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl mx-auto mb-12"
      >
        <div className="relative group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted transition-colors group-focus-within:text-accent"
            size={20}
          />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-fg placeholder:text-muted/50 focus:border-accent/40 focus:ring-1 focus:ring-accent/10 transition-all text-base shadow-xl shadow-black/5"
          />
        </div>
      </motion.div>

      {filtered.length > 0 ? (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filtered.map((post) => (
            <motion.div key={post.id} variants={itemVariants}>
              <BlogCard post={post} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="text-center py-24 bg-surface-light dark:bg-surface-dark rounded-3xl border border-border-light dark:border-border-dark"
        >
          <p className="text-muted">{t.noArticles}</p>
        </motion.div>
      )}
    </>
  );
}
