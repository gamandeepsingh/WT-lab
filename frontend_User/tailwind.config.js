/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        secondary: '#232800',
        primary: '#b8d21e',
        text: '#000',
        custom_white: '#fff',
        white: '#f6f6f6',
        dull: '#f6f6f6',
        lightPrimary: '#f8f9fa',
        darkPrimary: '#000',
        dullBlack: '#141414',
        lightSecondary: '#e9ecef',
        darkSecondary: '#343a40',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        dahlia: ['Dahlia'],
      },
      backgroundImage: {
        'custom-gradient': 'linear-gradient(180deg, rgba(11, 11, 11, 0) 0%, rgba(10, 10, 10, 0.77) 48%, #0A0A0A 100%)',
        'custom-card-gradient': 'linear-gradient(0deg, rgba(11, 11, 11, 0) 0%, rgba(10, 10, 10, 0.77) 24%, #0A0A0A 100%)',
      },
      borderRadius: {
        '4xl': '40px',
        '5xl': '50px',
      },
    },
  },
  plugins: [],
}