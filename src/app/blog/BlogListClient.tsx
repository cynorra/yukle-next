'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import BlogCard from '@/components/blog/BlogCard';
import type { BlogPost } from '@/types/database';

interface Props {
  posts: BlogPost[];
}

export function BlogListClient({ posts }: Props) {
  const [search, setSearch] = useState('');

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="max-w-xl mx-auto mb-12">
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            size={20}
          />
          <input
            type="text"
            placeholder="Yazılarda ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-fg placeholder:text-muted/50 focus:border-accent/40 focus:ring-1 focus:ring-accent/10 transition-all text-lg shadow-xl shadow-black/5"
          />
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-surface-light dark:bg-surface-dark rounded-3xl border border-border-light dark:border-border-dark">
          <p className="text-muted">Aramanızla eşleşen yazı bulunamadı.</p>
        </div>
      )}
    </>
  );
}
