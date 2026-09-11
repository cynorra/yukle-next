'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Trash2, ShieldAlert, Mail, LogIn, CheckCircle2 } from 'lucide-react';

import { useT } from '@/hooks/useT';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { getAppTranslation, fillTemplate } from '@/utils/getAppTranslation';
import type { getLegalTranslation } from '@/utils/getLegalTranslation';

interface Props {
  data: ReturnType<typeof getLegalTranslation>;
}

const CONTACT_EMAIL = 'kvkk@loadlyapp.com';

export function DeleteAccountPageClient({ data }: Props) {
  const t = useT();
  const router = useRouter();
  const params = useParams();
  const locale = typeof params?.locale === 'string' ? params.locale : 'en';
  const content = data.accountDeletion;
  const c = getAppTranslation(locale);
  const { user, loading } = useAuth();

  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    if (!user) return;
    setDeleting(true);
    setError(null);
    const { error: rpcError } = await supabase.rpc('delete_user_account', { p_user_id: user.id });
    setDeleting(false);
    if (rpcError) {
      setError(rpcError.message);
      return;
    }
    setDone(true);
    setTimeout(() => router.push(`/${locale}`), 2000);
  }

  return (
    <div className={t.pageFull}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className={`text-2xl font-bold ${t.heading} flex items-center gap-3`}>
            <Trash2 size={28} className="text-[#A66700]" />
            {content.title}
          </h1>
          <p className={`text-sm ${t.muted} mt-1`}>{content.intro}</p>
        </div>

        <div className={`p-6 rounded-2xl ${t.card} mb-4`}>
          {loading ? (
            <p className={`text-sm ${t.sub}`}>...</p>
          ) : done ? (
            <div className="flex items-center gap-2 text-green-500 text-sm font-medium">
              <CheckCircle2 size={18} />
              {c.profile.deleteConfirmYes}
            </div>
          ) : user ? (
            <div className="space-y-3">
              {!confirming ? (
                <button
                  onClick={() => setConfirming(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 size={16} />
                  {c.profile.deleteAccount}
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-red-400 font-medium">{c.profile.deleteConfirmText}</p>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <div className="flex gap-3">
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className={`px-4 py-2 rounded-xl text-sm font-bold bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-60`}
                    >
                      {deleting ? '...' : c.profile.deleteConfirmYes}
                    </button>
                    <button
                      onClick={() => setConfirming(false)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${t.btnSecondary}`}
                    >
                      {c.common.cancel}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <p className={`text-sm ${t.sub}`}>{content.signedInPrompt}</p>
              <Link
                href={`/${locale}/login`}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${t.btnPrimary}`}
              >
                <LogIn size={16} />
                {content.loginCta}
              </Link>
            </div>
          )}
        </div>

        <div className={`p-6 rounded-2xl ${t.card} mb-4`}>
          <div className="flex items-start gap-3">
            <Mail size={18} className={`${t.muted} shrink-0 mt-0.5`} />
            <p className={`text-sm ${t.sub} leading-relaxed`}>
              {fillTemplate(content.notSignedInNote, { email: CONTACT_EMAIL })}
            </p>
          </div>
        </div>

        <div className={`p-6 rounded-2xl ${t.card} mb-4`}>
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>{content.whatGetsDeletedTitle}</h2>
          <ul className={`list-disc list-inside space-y-2 text-sm ${t.sub}`}>
            <li>{content.whatGetsDeletedL1}</li>
            <li>{content.whatGetsDeletedL2}</li>
            <li>{content.whatGetsDeletedL3}</li>
            <li>{content.whatGetsDeletedL4}</li>
          </ul>
        </div>

        <div className="p-5 rounded-2xl bg-red-500/5 border border-red-500/20">
          <div className="flex items-start gap-3">
            <ShieldAlert size={18} className="text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-300 leading-relaxed">
              {content.retainedNote}{' '}
              <Link href={`/${locale}/privacy`} className="underline">
                {content.privacyLinkText}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
