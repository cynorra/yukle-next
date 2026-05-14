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
      fontSize: {
        xs: ['1rem', { lineHeight: '1.5rem' }],
        sm: ['1.15rem', { lineHeight: '1.7rem' }],
        base: ['1.25rem', { lineHeight: '1.8rem' }],
        lg: ['1.5rem', { lineHeight: '2rem' }],
        xl: ['1.75rem', { lineHeight: '2.2rem' }],
        '2xl': ['2.1rem', { lineHeight: '2.5rem' }],
        '3xl': ['2.7rem', { lineHeight: '3rem' }],
        '4xl': ['3.5rem', { lineHeight: '3.8rem' }],
        '5xl': ['4.5rem', { lineHeight: '1.1' }],
        '6xl': ['5.5rem', { lineHeight: '1' }],
      },
      fontFamily: {
        sans: ['"Lexend"', '"Outfit"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        display: ['"Lexend"', '"Outfit"', 'Inter Tight', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
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
