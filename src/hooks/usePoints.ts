'use client';

import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export function usePoints() {
  const { user } = useAuth();

  const awardPoints = useCallback(
    async (
      reason: string,
      description: string,
      loadId?: string
    ): Promise<boolean> => {
      if (!user) return false;
      const { error } = await supabase.rpc('add_points', {
        p_user_id: user.id,
        p_reason: reason,
        p_description: description,
        p_load_id: loadId ?? null,
      });
      return !error;
    },
    [user]
  );

  const checkDailyLogin = useCallback(async () => {
    if (!user) return;
    await supabase.rpc('add_points', {
      p_user_id: user.id,
      p_points: 10,
      p_reason: 'daily_login',
      p_description: 'Günlük giriş puanı',
      p_load_id: null,
    });
  }, [user]);

  const awardProfileComplete = useCallback(async () => {
    if (!user) return;
    await supabase.rpc('add_points', {
      p_user_id: user.id,
      p_points: 30,
      p_reason: 'profile_complete',
      p_description: 'Profil tamamlama bonusu',
      p_load_id: null,
    });
  }, [user]);

  const awardFirstMessage = useCallback(async () => {
    if (!user) return;
    await supabase.rpc('add_points', {
      p_user_id: user.id,
      p_points: 20,
      p_reason: 'first_message',
      p_description: 'İlk mesaj gönderme bonusu',
      p_load_id: null,
    });
  }, [user]);

  return { awardPoints, checkDailyLogin, awardProfileComplete, awardFirstMessage };
}
