import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/contexts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: {
        '2xl': '1440px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--if-border))',
        input: 'hsl(var(--if-input))',
        ring: 'hsl(var(--if-ring))',
        background: 'hsl(var(--if-background))',
        foreground: 'hsl(var(--if-foreground))',
        primary: {
          DEFAULT: 'hsl(var(--if-primary))',
          foreground: 'hsl(var(--if-primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--if-secondary))',
          foreground: 'hsl(var(--if-secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--if-muted))',
          foreground: 'hsl(var(--if-muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--if-accent))',
          foreground: 'hsl(var(--if-accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--if-destructive))',
          foreground: 'hsl(var(--if-destructive-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--if-success))',
          foreground: 'hsl(var(--if-success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--if-warning))',
          foreground: 'hsl(var(--if-warning-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--if-card))',
          foreground: 'hsl(var(--if-card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--if-popover))',
          foreground: 'hsl(var(--if-popover-foreground))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--if-sidebar))',
          foreground: 'hsl(var(--if-sidebar-foreground))',
          accent: 'hsl(var(--if-sidebar-accent))',
          border: 'hsl(var(--if-sidebar-border))',
        },
        /* InsureFlow teal primary scale — `if-*`, anchored on #0d9488. */
        if: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        /* Secondary accent scale used for charts and highlights. */
        'if-sky': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
      },
      fontFamily: {
        sans: ['var(--if-font-sans)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--if-font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        display: ['var(--if-font-display)', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--if-radius)',
        md: 'calc(var(--if-radius) - 2px)',
        sm: 'calc(var(--if-radius) - 4px)',
      },
      boxShadow: {
        if: '0 1px 3px 0 rgb(13 148 136 / 0.08), 0 1px 2px -1px rgb(13 148 136 / 0.14)',
        'if-lg': '0 10px 25px -5px rgb(13 148 136 / 0.16), 0 8px 10px -6px rgb(13 148 136 / 0.1)',
        'if-glow': '0 0 0 1px rgb(13 148 136 / 0.16), 0 8px 30px rgb(13 148 136 / 0.18)',
      },
      keyframes: {
        'if-fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'if-fade-out': {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(8px)' },
        },
        'if-slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'if-slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'if-scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'if-pulse-dot': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.35)' },
        },
        'if-shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'if-count-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'if-progress': {
          '0%': { width: '0%' },
          '100%': { width: 'var(--if-progress, 100%)' },
        },
        'if-spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'if-float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'if-glow-ring': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgb(13 148 136 / 0.35)' },
          '50%': { boxShadow: '0 0 0 6px rgb(13 148 136 / 0)' },
        },
      },
      animation: {
        'if-fade-in': 'if-fade-in 0.35s ease-out both',
        'if-fade-out': 'if-fade-out 0.25s ease-in both',
        'if-slide-in-right': 'if-slide-in-right 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
        'if-slide-in-left': 'if-slide-in-left 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
        'if-scale-in': 'if-scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) both',
        'if-pulse-dot': 'if-pulse-dot 1.6s ease-in-out infinite',
        'if-shimmer': 'if-shimmer 2s linear infinite',
        'if-count-up': 'if-count-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        'if-progress': 'if-progress 1s cubic-bezier(0.16, 1, 0.3, 1) both',
        'if-spin-slow': 'if-spin-slow 3s linear infinite',
        'if-float': 'if-float 4s ease-in-out infinite',
        'if-glow-ring': 'if-glow-ring 2s ease-in-out infinite',
      },
      transitionTimingFunction: {
        'if-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      opacity: {
        if: '0.72',
      },
      zIndex: {
        'if-sidebar': '40',
        'if-header': '30',
        'if-dropdown': '50',
        'if-modal': '60',
        'if-toast': '70',
      },
    },
  },
  plugins: [],
};

export default config;
