/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#eef4fb',
          100: '#d6e4f3',
          200: '#aec9e6',
          300: '#7ea4d4',
          400: '#4d7dbf',
          500: '#2f5fa3',
          600: '#1e4a87',
          700: '#173a6c',
          800: '#0f2742',
          900: '#0a1c33',
          950: '#06121f',
        },
        risk: {
          low: '#16a34a',
          moderate: '#eab308',
          high: '#f97316',
          critical: '#dc2626',
        },
      },
      boxShadow: {
        card: '0 1px 3px rgba(15, 39, 66, 0.08), 0 1px 2px rgba(15, 39, 66, 0.06)',
        'card-hover': '0 8px 25px -5px rgba(15, 39, 66, 0.15)',
      },
    },
  },
  plugins: [],
};
