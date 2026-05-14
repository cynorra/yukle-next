'use client';

import { Clock, Calendar, AlertTriangle } from 'lucide-react';
import { calcDeliveryDays, calcDaysUntilPickup } from '@/utils/loadTags';
import { useTheme } from '@/contexts/ThemeContext';

interface DeliveryDaysBadgeProps {
  pickupDate: string | null;
  deliveryDate: string | null;
  showPickupCountdown?: boolean;
}

export default function DeliveryDaysBadge({ pickupDate, deliveryDate, showPickupCountdown = false }: DeliveryDaysBadgeProps) {
  const { isDark } = useTheme();
  const deliveryDays = calcDeliveryDays(pickupDate, deliveryDate);
  const daysUntilPickup = calcDaysUntilPickup(pickupDate);

  if (!deliveryDays && !showPickupCountdown) return null;

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {/* Teslim süresi */}
      {deliveryDays !== null && (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${
          deliveryDays <= 1
            ? isDark ? 'text-red-400 bg-red-400/10 border-red-400/30' : 'text-red-600 bg-red-50 border-red-200'
            : deliveryDays <= 3
            ? isDark ? 'text-orange-400 bg-orange-400/10 border-orange-400/30' : 'text-orange-600 bg-orange-50 border-orange-200'
            : isDark ? 'text-blue-400 bg-blue-400/10 border-blue-400/30' : 'text-blue-600 bg-blue-50 border-blue-200'
        }`}>
          <Clock size={11} />
          {deliveryDays === 1 ? '1 günde teslim' : `${deliveryDays} günde teslim`}
        </span>
      )}

      {/* Yükleme tarihi yaklaşıyor */}
      {showPickupCountdown && daysUntilPickup !== null && daysUntilPickup >= 0 && daysUntilPickup <= 3 && (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${
          daysUntilPickup === 0
            ? isDark ? 'text-red-400 bg-red-400/10 border-red-400/30' : 'text-red-600 bg-red-50 border-red-200'
            : isDark ? 'text-amber-400 bg-amber-400/10 border-amber-400/30' : 'text-amber-600 bg-amber-50 border-amber-200'
        }`}>
          <AlertTriangle size={11} />
          {daysUntilPickup === 0 ? 'Bugün yükleme' : `${daysUntilPickup} gün sonra yükleme`}
        </span>
      )}

      {/* Geçmiş tarih */}
      {showPickupCountdown && daysUntilPickup !== null && daysUntilPickup < 0 && (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs ${
          isDark ? 'text-gray-500 bg-gray-500/10 border-gray-500/20' : 'text-slate-400 bg-slate-100 border-slate-200'
        }`}>
          <Calendar size={11} />
          Tarih geçti
        </span>
      )}
    </div>
  );
}
