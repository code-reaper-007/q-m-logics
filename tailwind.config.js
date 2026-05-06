/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        accent: {
          cyan: "#00f3ff",
          purple: "#bc13fe",
          pink: "#ff00ff",
        },
      },
      backgroundImage: {
        'cyber-grid': "radial-gradient(circle, rgba(20,20,20,0.8) 1px, transparent 1px)",
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: 1, filter: 'brightness(1)' },
          '50%': { opacity: 0.8, filter: 'brightness(1.5)' },
        },
      },
    },
  },
  plugins: [],
}
