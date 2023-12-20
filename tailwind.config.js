module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#735eff',
          200: '#7F6BFF',
          300: '#998AFF',
          neon: '#1F51FF',
        },
        secondary: { 100: '#fd7544', 200: '#FD5244' },
        tertiary: { 100: '#0a1046' },
      },
      fontFamily: {
        sans: ['var(--font-jost)'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
