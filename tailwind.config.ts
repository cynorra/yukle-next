import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: { light: '#f8fafc', dark: '#080808' },
        surface: { light: '#ffffff', dark: '#0f0f0f' },
        accent: {
          // Was #F5A623 (1.94:1 vs white - fails WCAG AA's 4.5:1 body-text /
          // 3:1 large-text minimum). #A66700 is the same hue darkened to
          // 4.60:1 vs white while staying WCAG AA on dark backgrounds too
          // (4.35:1 vs #080808) - see design-adsense-review memory.
          DEFAULT: '#A66700',
          light: '#A66700',
          dark: '#A66700',
          muted: 'rgba(166, 103, 0, 0.1)',
        },
        border: {
          light: 'rgba(0, 0, 0, 0.08)',
          dark: 'rgba(255, 255, 255, 0.06)',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter Tight', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '500',
        bold: '600',
        extrabold: '700',
        black: '800',
      },
    },
  },
  plugins: [],
  safelist: [
    'bg-background-light', 'bg-background-dark',
    'bg-surface-light', 'bg-surface-dark',
    'border-border-light', 'border-border-dark',
    'text-accent', 'bg-accent/10', 'border-accent/20',
    'shadow-sm', 'shadow-md', 'shadow-lg',
    'hover:shadow-xl', 'transition-all', 'duration-300',
  ],
};

export default config;
