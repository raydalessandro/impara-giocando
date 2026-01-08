/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      scale: {
        '102': '1.02',
        '103': '1.03',
      },
    },
  },
  plugins: [],
  safelist: [
    // Colors for dynamic classes
    'bg-blue-500', 'bg-blue-600', 'bg-blue-700',
    'bg-green-500', 'bg-green-600', 'bg-green-700',
    'bg-red-500', 'bg-red-600', 'bg-red-700',
    'bg-yellow-500', 'bg-yellow-600', 'bg-yellow-700',
    'bg-purple-500', 'bg-purple-600', 'bg-purple-700',
    'bg-pink-500', 'bg-pink-600', 'bg-pink-700',
    'bg-orange-500', 'bg-orange-600', 'bg-orange-700',
    'bg-gray-500', 'bg-gray-600', 'bg-gray-700',
    'text-blue-600', 'text-green-600', 'text-red-600',
    'text-yellow-600', 'text-purple-600', 'text-pink-600',
    'text-orange-600',
  ],
}
