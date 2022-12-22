/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./views/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          main: '#28282a',
          dark: '#1e1e1f',
          text: '#ffffff',
        },
        action: {
          active: 'rgba(0,0,0,0.54)',
          disabled: 'rgba(0,0,0,0.26)',
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
