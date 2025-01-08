/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'deep-blue': '#1E3A8A',
        'soft-white': '#F9FAFB',
        'muted-gray': '#6B7280',
        'bright-orange': '#F97316',
        'vivid-green': '#16A34A',
        'soft-red': '#DC2626',
        'light-gray': '#E5E7EB',
        'dark-charcoal': '#111827',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'roboto': ['Roboto', 'sans-serif'],
    },
    },
  },
  plugins: [],
}

