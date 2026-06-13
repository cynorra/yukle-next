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
          DEFAULT: '#F5A623',
          light: '#F5A623',
          dark: '#F5A623',
          muted: 'rgba(245, 166, 35, 0.1)',
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
