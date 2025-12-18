/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Varela Round"', 'system-ui', 'sans-serif'],
        ui: ['"Varela Round"', 'system-ui', 'sans-serif'],
        'mono-tech': ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}