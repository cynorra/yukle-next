'use client';

import { useState } from 'react';
import Image from 'next/image';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop';

interface PostImageProps {
  src: string | null;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}

// Cover images come from scraped/stock sources and occasionally 404, so the
// homepage swaps in the same fallback BlogCard uses instead of a broken box.
export function PostImage({ src, alt, sizes, priority, className }: PostImageProps) {
  const [imgSrc, setImgSrc] = useState(src || FALLBACK_IMAGE);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
      onError={() => setImgSrc(FALLBACK_IMAGE)}
    />
  );
}
