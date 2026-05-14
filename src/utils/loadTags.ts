import { Zap, Clock, Calendar, Package, Layers, AlertTriangle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface TagConfig {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  border: string;
  darkColor: string;
  darkBg: string;
  darkBorder: string;
}

export const LOAD_TAGS: TagConfig[] = [
  {
    id: 'urgent',
    label: 'Acil',
    icon: Zap,
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    darkColor: 'text-red-400',
    darkBg: 'bg-red-400/10',
    darkBorder: 'border-red-400/30',
  },
  {
    id: 'express',
    label: 'Ekspres',
    icon: Clock,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    darkColor: 'text-orange-400',
    darkBg: 'bg-orange-400/10',
    darkBorder: 'border-orange-400/30',
  },
  {
    id: 'flexible',
    label: 'Tarih Esnek',
    icon: Calendar,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    darkColor: 'text-blue-400',
    darkBg: 'bg-blue-400/10',
    darkBorder: 'border-blue-400/30',
  },
  {
    id: 'fragile',
    label: 'Kırılgan',
    icon: AlertTriangle,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    darkColor: 'text-amber-400',
    darkBg: 'bg-amber-400/10',
    darkBorder: 'border-amber-400/30',
  },
  {
    id: 'partial',
    label: 'Parsiyel',
    icon: Layers,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    darkColor: 'text-purple-400',
    darkBg: 'bg-purple-400/10',
    darkBorder: 'border-purple-400/30',
  },
  {
    id: 'full_load',
    label: 'Komple Yük',
    icon: Package,
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
    darkColor: 'text-green-400',
    darkBg: 'bg-green-400/10',
    darkBorder: 'border-green-400/30',
  },
];

export function getTagConfig(tagId: string): TagConfig | undefined {
  return LOAD_TAGS.find((t) => t.id === tagId);
}

/** Teslim gün sayısını hesapla */
export function calcDeliveryDays(pickupDate: string | null, deliveryDate: string | null): number | null {
  if (!pickupDate || !deliveryDate) return null;
  const diff = new Date(deliveryDate).getTime() - new Date(pickupDate).getTime();
  const days = Math.round(diff / (1000 * 60 * 60 * 24));
  return days > 0 ? days : null;
}

/** Kalan gün sayısı (ilan ne kadar süre geçerli) */
export function calcDaysUntilPickup(pickupDate: string | null): number | null {
  if (!pickupDate) return null;
  const diff = new Date(pickupDate).getTime() - Date.now();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days;
}
