/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        midnight: '#070B12',
        arctic: '#101D2C',
        glacier: '#172B3D',
        iceCyan: '#7DEBFF',
        glacierBlue: '#A8DFFF',
        crystalWhite: '#F4FAFF',
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"DM Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
