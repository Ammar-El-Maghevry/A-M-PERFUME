import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F5EFE6',
        ivory: '#FAF6F0',
        paper: '#EFE7DA',
        charcoal: '#1A1A1A',
        graphite: '#2D2D2D',
        'warm-gray': '#6B6560',
        'light-gray': '#E8E2D9',
        hairline: '#D9D2C5',
        accent: '#8B7355',
        'accent-soft': '#C9B79A',
        success: '#6B8E5A',
        error: '#A04545',
        warning: '#B8924A',
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
