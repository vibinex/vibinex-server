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
          active: 'rgba(0,0,0,0.54)',
          disabled: 'rgba(0,0,0,0.26)',
        }
      },
      fontFamily: {
        custom: ['Raleway', 'Roboto', 'sans-serif']
      },
      spacing: {
        'screen-1/2': "50vh"
      },
      keyframes: {
        slideDown: {
          '0%': { height: 0 },
          '100%': { height: '100vh' }
        },
        slideUp: {
          '0%': { height: '100vh' },
          '100%': { height: 0 }
        }
      },
      animation: {
        openAccordion: 'slideDown 300ms',
        closeAccordion: 'slideUp 300ms'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}