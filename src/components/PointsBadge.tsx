'use client';

import { Zap } from 'lucide-react';

interface PointsBadgeProps {
  points: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function PointsBadge({ points, size = 'md', showLabel = false }: PointsBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-3 py-1 gap-1.5',
    lg: 'text-base px-4 py-2 gap-2',
  };
  const iconSizes = { sm: 12, md: 14, lg: 18 };

  return (
    <div
      className={`inline-flex items-center ${sizeClasses[size]} rounded-full bg-[#F5A623]/10 border border-[#F5A623]/30 text-[#F5A623] font-bold`}
    >
      <Zap size={iconSizes[size]} className="fill-[#F5A623]" />
      <span>{points.toLocaleString('tr-TR')}</span>
      {showLabel && <span className="font-normal text-[#F5A623]/70">puan</span>}
    </div>
  );
}
