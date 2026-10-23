'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Calendar, User, ArrowRight } from 'lucide-react';
import BlogCard from '@/components/blog/BlogCard';
import type { BlogPost } from '@/types/database';
import { useTranslation } from '@/hooks/useTranslation';
import { BLOG_TRANSLATIONS } from '@/utils/blogTranslations';
import type { Locale } from '@/utils/translations';
import { motion, Variants } from 'framer-motion';

interface Props {
  posts: BlogPost[];
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export function BlogListClient({ posts }: Props) {
  const [search, setSearch] = useState('');
  const [selectedCluster, setSelectedCluster] = useState<string>('All');
  const { locale } = useTranslation();
  const activeLocale = (locale in BLOG_TRANSLATIONS) ? (locale as Locale) : 'en';
  const t = BLOG_TRANSLATIONS[activeLocale];

  // Extract unique clusters
  const clusters = useMemo(() => {
    const set = new Set<string>();
    posts.forEach(p => {
      if (p.topic_cluster) set.add(p.topic_cluster);
    });
    return ['All', ...Array.from(set)];
  }, [posts]);

  // Featured Hero post (the latest one if no search is active)
  const featuredPost = useMemo(() => {
    if (search || selectedCluster !== 'All' || posts.length === 0) return null;
    return posts[0];
  }, [posts, search, selectedCluster]);

  // Rest of the posts
  const remainingPosts = useMemo(() => {
    let list = posts;
    if (featuredPost) {
      list = posts.slice(1);
    }
    return list.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.excerpt?.toLowerCase().includes(search.toLowerCase());
      const matchesCluster =
        selectedCluster === 'All' || p.topic_cluster === selectedCluster;
      return matchesSearch && matchesCluster;
    });
  }, [posts, featuredPost, search, selectedCluster]);

  return (
    <>
      {/* Featured Hero Story (when on All and no search) */}
      {featuredPost && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-14"
        >
          <Link
            href={`/${featuredPost.language || 'en'}/blog/${featuredPost.slug}`}
            className="group relative block rounded-3xl overflow-hidden bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark hover:border-accent/50 shadow-xl transition-all duration-300"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              <div className="relative aspect-[16/10] lg:aspect-auto lg:col-span-7 overflow-hidden min-h-[300px] lg:min-h-[420px]">
                <Image
                  src={featuredPost.cover_image || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop'}
                  alt={featuredPost.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/30" />
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                  <span className="inline-flex items-center px-3 py-1 text-xs font-bold uppercase tracking-wider text-white bg-accent rounded-lg shadow-sm">
                    Featured
                  </span>
                  {featuredPost.topic_cluster && (
                    <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-white bg-black/70 backdrop-blur-sm rounded-lg border border-white/10">
                      {featuredPost.topic_cluster}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-8 lg:p-12 lg:col-span-5 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-4 text-xs font-semibold text-muted">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-accent" />
                    {new Date(featuredPost.created_at).toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  {featuredPost.author && (
                    <span className="flex items-center gap-1.5">
                      <User size={14} className="text-accent" />
                      {featuredPost.author.full_name}
                    </span>
                  )}
                </div>

                <h2 className="text-2xl lg:text-3xl font-black text-fg mb-4 group-hover:text-accent transition-colors leading-tight">
                  {featuredPost.title}
                </h2>

                <p className="text-base text-muted line-clamp-3 mb-6 leading-relaxed">
                  {featuredPost.excerpt}
                </p>

                <div className="inline-flex items-center gap-2 text-accent font-extrabold text-sm group-hover:translate-x-1 transition-transform">
                  Read Full Investigation
                  <ArrowRight size={18} />
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      )}

      {/* Search & Topic Tabs Bar */}
      <div className="space-y-6 mb-12">
        {/* Search Input */}
        <div className="max-w-xl mx-auto">
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
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-fg placeholder:text-muted/50 focus:border-accent/40 focus:ring-2 focus:ring-accent/10 transition-all text-sm shadow-md"
            />
          </div>
        </div>

        {/* Topic Cluster Filter Pills */}
        {clusters.length > 2 && (
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none px-2">
            {clusters.map((cluster) => {
              const isActive = selectedCluster === cluster;
              return (
                <button
                  key={cluster}
                  onClick={() => setSelectedCluster(cluster)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-accent text-white shadow-md shadow-accent/20 scale-105'
                      : 'bg-surface-light dark:bg-surface-dark text-muted hover:text-fg hover:border-accent/30 border border-border-light dark:border-border-dark'
                  }`}
                >
                  {cluster}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Grid */}
      {remainingPosts.length > 0 ? (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {remainingPosts.map((post) => (
            <motion.div key={post.id} variants={itemVariants}>
              <BlogCard post={post} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="text-center py-20 bg-surface-light dark:bg-surface-dark rounded-3xl border border-border-light dark:border-border-dark"
        >
          <p className="text-muted">{t.noArticles}</p>
        </motion.div>
      )}
    </>
  );
}
