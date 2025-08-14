
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(200 8% 98%)',
        accent: 'hsl(30 90% 55%)',
        primary: 'hsl(240 70% 50%)',
        surface: 'hsl(200 8% 100%)',
        'neutral-100': 'hsl(200 8% 95%)',
        'neutral-500': 'hsl(200 8% 50%)',
        'neutral-900': 'hsl(200 8% 10%)',
      },
      spacing: {
        xs: '4px',
        sm: '4px',
        md: '8px',
        lg: '16px',
        xl: '24px',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
      },
      boxShadow: {
        card: '0 4px 12px hsla(200, 8%, 10%, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-in-out',
        'slide-up': 'slideUp 200ms ease-in-out',
        'pulse-fast': 'pulse 100ms ease-in-out',
      },
      typography: {
        display: ['text-3xl', { fontWeight: '700' }],
        heading: ['text-xl', { fontWeight: '600' }],
        body: ['text-base', { fontWeight: '400', lineHeight: '1.6' }],
      },
      gridTemplateColumns: {
        '12': 'repeat(12, minmax(0, 1fr))',
      },
      gap: {
        'gutter': '16px',
      },
    },
  },
  plugins: [],
}
