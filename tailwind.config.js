module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: { 100: '#735eff', 200: '#1F51FF' },
        secondary: { 100: '#fd7544', 200: '#FD5244' },
      },
      fontFamily: {
        sans: ['var(--font-jost)'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
