'use client';

import Link from 'next/link';

export default function Logo({
  size = 'medium',
  noLink = false,
}: {
  size?: 'small' | 'medium' | 'large';
  noLink?: boolean;
}) {
  const sizes = {
    small: { img: 32, text: 'text-xl' },
    medium: { img: 40, text: 'text-2xl' },
    large: { img: 64, text: 'text-5xl' },
  };
  const s = sizes[size];

  const content = (
    <div className="flex items-center gap-2 group transition-transform active:scale-95">
      <div
        className="rounded-xl overflow-hidden shrink-0 bg-accent p-1 shadow-lg shadow-accent/20 group-hover:shadow-accent/40 transition-all"
        style={{ width: s.img, height: s.img }}
      >
        <img src="/logo.png" alt="Loadly" className="w-full h-full object-contain" />
      </div>
      <div className="flex flex-col leading-none">
        <span className={`${s.text} font-black tracking-tighter text-fg`}>
          Load<span className="text-accent">ly</span>
        </span>
        <span className="text-[10px] font-semibold tracking-widest text-muted uppercase opacity-60">
          loadlyapp.com
        </span>
      </div>
    </div>
  );

  if (noLink) {
    return content;
  }

  return <Link href="/">{content}</Link>;
}