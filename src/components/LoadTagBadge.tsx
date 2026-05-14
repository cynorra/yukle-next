'use client';

import { getTagConfig } from '@/utils/loadTags';
import { useTheme } from '@/contexts/ThemeContext';

interface LoadTagBadgeProps {
  tag: string;
  size?: 'sm' | 'md';
}

export default function LoadTagBadge({ tag, size = 'sm' }: LoadTagBadgeProps) {
  const { isDark } = useTheme();
  const config = getTagConfig(tag);
  if (!config) return null;

  const Icon = config.icon;
  const color = isDark ? config.darkColor : config.color;
  const bg = isDark ? config.darkBg : config.bg;
  const border = isDark ? config.darkBorder : config.border;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${color} ${bg} ${border}`}>
      <Icon size={size === 'sm' ? 11 : 13} />
      {config.label}
    </span>
  );
}
