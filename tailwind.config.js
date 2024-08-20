const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      xs: '475px',
      ...defaultTheme.screens,
    },
    extend: {
      colors: {
        primary: {
          100: '#735eff',
          200: '#7F6BFF',
          300: '#998AFF',
          neon: '#1F51FF',
        },
        secondary: { 100: '#B5FFE1', 200: '#FD5244', 300: '#fd7544' },
        tertiary: { 100: '#0a1046' },
        'border-color': 'fd7544',
      },
      fontFamily: {
        sans: ['var(--font-jost)'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    function ({ addVariant }) {
      addVariant('hover-focus', '&:hover:focus'); // This adds the hover and focus state together
    },
  ],
};
