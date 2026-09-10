'use client';

import { useParams } from 'next/navigation';
import { Zap } from 'lucide-react';
import { formatLocaleNumber } from '@/utils/intlFormat';

interface PointsBadgeProps {
  points: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function PointsBadge({ points, size = 'md', showLabel = false }: PointsBadgeProps) {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-3 py-1 gap-1.5',
    lg: 'text-base px-4 py-2 gap-2',
  };
  const iconSizes = { sm: 12, md: 14, lg: 18 };

  return (
    <div
      className={`inline-flex items-center ${sizeClasses[size]} rounded-full bg-[#A66700]/10 border border-[#A66700]/30 text-[#A66700] font-bold`}
    >
      <Zap size={iconSizes[size]} className="fill-[#A66700]" />
      <span>{formatLocaleNumber(locale, points)}</span>
      {showLabel && <span className="font-normal text-[#A66700]/70">{locale === 'tr' ? 'puan' : 'pts'}</span>}
    </div>
  );
}
