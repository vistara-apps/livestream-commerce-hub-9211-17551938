module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(200 8% 98%)',
        accent: 'hsl(30 90% 55%)',
        primary: 'hsl(240 70% 50%)',
        'primary-light': 'hsl(240 70% 95%)',
        surface: 'hsl(200 8% 100%)',
        'neutral-100': 'hsl(200 8% 95%)',
        'neutral-200': 'hsl(200 8% 90%)',
        'neutral-300': 'hsl(200 8% 80%)',
        'neutral-400': 'hsl(200 8% 60%)',
        'neutral-500': 'hsl(200 8% 50%)',
        'neutral-600': 'hsl(200 8% 40%)',
        'neutral-700': 'hsl(200 8% 30%)',
        'neutral-800': 'hsl(200 8% 20%)',
        'neutral-900': 'hsl(200 8% 10%)',
        success: 'hsl(142 76% 36%)',
        'success-light': 'hsl(142 76% 95%)',
        error: 'hsl(0 84% 60%)',
        'error-light': 'hsl(0 84% 95%)',
        warning: 'hsl(38 92% 50%)',
        'warning-light': 'hsl(38 92% 95%)',
      },
      spacing: {
        xs: '0.25rem',    // 4px
        sm: '0.5rem',     // 8px
        md: '0.75rem',    // 12px
        lg: '1rem',       // 16px
        xl: '1.5rem',     // 24px
        '2xl': '2rem',    // 32px
        '3xl': '3rem',    // 48px
      },
      borderRadius: {
        sm: '0.25rem',    // 4px
        md: '0.375rem',   // 6px
        lg: '0.5rem',     // 8px
        xl: '0.75rem',    // 12px
        '2xl': '1rem',    // 16px
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        card: '0 2px 8px hsla(200, 8%, 10%, 0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-out forwards',
        'slide-up': 'slideUp 200ms ease-out forwards',
        'slide-in': 'slideIn 200ms ease-out forwards',
        'scale-up': 'scaleUp 200ms ease-out forwards',
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      typography: {
        display: ['text-4xl', { fontWeight: '700', letterSpacing: '-0.025em' }],
        heading: ['text-2xl', { fontWeight: '600', letterSpacing: '-0.025em' }],
        subheading: ['text-lg', { fontWeight: '500' }],
        body: ['text-base', { fontWeight: '400', lineHeight: '1.6' }],
        small: ['text-sm', { fontWeight: '400' }],
      },
      gridTemplateColumns: {
        '12': 'repeat(12, minmax(0, 1fr))',
      },
      gap: {
        'gutter': '1rem',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      zIndex: {
        'toast': '1000',
        'modal': '900',
        'dropdown': '800',
        'header': '700',
      },
    },
  },
  plugins: [],
}

