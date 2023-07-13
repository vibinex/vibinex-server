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
          light: '#ffffff',
          main: '#2196F3',
          dark: '#1e1e1f',
          text: '#9E9E9E',
          darktext: '#000000'
        },
        secondary: {
          main: '#f3f4f6',
          dark: '#000000',
          light: '#00c2e0'
        },
        action: {
          active: '#2196F3',
          activeDisabled: '#2196F355',
          inactive: '#C4C4C4',
          inactiveDisabled: '#C4C4C455',
        }
      },
      fontFamily: {
        custom: ['Raleway', 'Roboto', 'sans-serif'],
        money: ['Roboto', 'sans-serif'],
      },
      spacing: {
        'screen-1/2': "50vh"
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}