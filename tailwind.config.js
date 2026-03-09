/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        replio: {
          bg: '#140606',
          red: '#E4002B',
          darkred: '#8C0016',
          card: '#1F0808',
          muted: '#A08080',
          gray: '#D4B8B8',
        }
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        playfair: ['Playfair Display', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
        body: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
