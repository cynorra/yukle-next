'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Star, X, Loader2, Send } from 'lucide-react';
import { useT } from '@/hooks/useT';
import { TextureCard, TextureCardTitle, TextureSeparator } from '@/components/ui/texture-card';
import { TextureButton } from '@/components/ui/texture-button';

interface ReviewModalProps {
  loadId: string;
  reviewedId: string;
  reviewedName: string;
  onClose: () => void;
  onSubmitted: () => void;
}

export default function ReviewModal({ loadId, reviewedId, reviewedName, onClose, onSubmitted }: ReviewModalProps) {
  const t = useT();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const LABELS = ['', 'Çok Kötü', 'Kötü', 'Orta', 'İyi', 'Mükemmel'];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) { setError('Lütfen bir puan seçin.'); return; }
    setSubmitting(true);
    const { error: err } = await supabase.from('reviews').insert({
      load_id: loadId, reviewed_id: reviewedId, rating, comment: comment.trim() || null,
    });
    if (err) {
      setError(err.code === '23505' ? 'Bu taşıma için zaten değerlendirme yaptınız.' : err.message);
      setSubmitting(false);
      return;
    }
    onSubmitted();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
      <TextureCard className="w-full max-w-md shadow-2xl overflow-hidden backdrop-blur-2xl bg-white/90 dark:bg-background-dark/90">
        <div className="flex items-center justify-between px-6 pt-5 pb-4">
          <TextureCardTitle className={t.heading}>Değerlendirme</TextureCardTitle>
          <TextureButton variant="icon" size="icon" onClick={onClose}>
            <X size={18} />
          </TextureButton>
        </div>
        <TextureSeparator />
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="text-center">
            <p className={`${t.sub} text-sm mb-1`}>Taşıma deneyiminizi değerlendirin</p>
            <p className={`${t.heading} font-bold text-lg`}>{reviewedName}</p>
          </div>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className="transition-transform hover:scale-110">
                <Star size={36} className={`transition-colors ${
                  star <= (hover || rating) ? 'text-[#F5A623] fill-[#F5A623]' : t.mutedDark
                }`} />
              </button>
            ))}
          </div>
          {(hover || rating) > 0 && (
            <p className={`text-center text-sm font-medium ${t.accent} -mt-2`}>{LABELS[hover || rating]}</p>
          )}
          <div>
            <label className={`block text-xs ${t.muted} mb-1.5`}>Yorum (opsiyonel)</label>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)}
              placeholder="Deneyiminizi paylaşın..." rows={3}
              className={`w-full px-4 py-3 rounded-xl text-sm focus:outline-none resize-none ${t.input}`} />
          </div>
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <TextureButton type="submit" variant="accent" disabled={submitting || rating === 0}
            className="w-full !rounded-xl">
            {submitting ? <><Loader2 size={16} className="animate-spin mr-2 inline" />Gönderiliyor...</> : <><Send size={16} className="mr-2 inline" />Değerlendirmeyi Gönder</>}
          </TextureButton>
        </form>
      </TextureCard>
    </div>
  );
}
