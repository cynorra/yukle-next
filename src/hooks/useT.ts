'use client';

import { useTheme } from '@/contexts/ThemeContext';

export function useT() {
  const { isDark } = useTheme();

  return {
    isDark,
    page: 'bg-background-light dark:bg-background-dark',
    pageFull: 'min-h-screen bg-background-light dark:bg-background-dark',
    card: 'bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-sm',
    cardHover: 'hover:border-accent/30 hover:shadow-md transition-all duration-200',
    cardInner: 'bg-background-light dark:bg-background-dark',
    banner: 'bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark',
    heading: 'font-display text-fg tracking-tight',
    body: 'text-fg/80',
    sub: 'text-muted',
    muted: 'text-muted/60',
    mutedDark: 'text-muted/40',
    accent: 'text-accent',
    accentBg: 'bg-accent/10',
    accentBorder: 'border-accent/20',
    accentBorderStrong: 'border-accent/40',
    accentFill: 'fill-accent',
    btnPrimary: 'bg-accent text-white font-bold shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:-translate-y-0.5 active:translate-y-0 transition-all',
    btnSecondary: 'bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-fg hover:bg-background-light dark:hover:bg-background-dark transition-all',
    btnDanger: 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-all',
    btnSuccess: 'bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500/20 transition-all',
    input: 'bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-fg placeholder:text-muted/50 focus:border-accent/40 focus:ring-1 focus:ring-accent/10 transition-all',
    divider: 'border-border-light dark:border-border-dark',
    dividerTop: 'border-t border-border-light dark:border-border-dark',
    badgeActive: 'text-accent bg-accent/10 border border-accent/20',
    badgeInTransit: 'text-blue-500 bg-blue-500/10 border border-blue-500/20',
    badgeCompleted: 'text-green-500 bg-green-500/10 border border-green-500/20',
    badgeCancelled: 'text-red-500 bg-red-500/10 border border-red-500/20',
    tabActive: 'bg-accent text-white font-bold',
    tabInactive: 'text-muted hover:text-fg hover:bg-surface-light dark:hover:bg-surface-dark',
    tabContainer: 'bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-1',
    spinner: 'border-accent/30 border-t-accent',
    iconBtn: 'text-muted hover:text-fg hover:bg-surface-light dark:hover:bg-surface-dark rounded-lg transition-all',
    select: 'bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-fg focus:border-accent/40 transition-all',
  };
}
