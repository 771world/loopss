/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      padding: {
        '0.25': '0.0625rem',
      },
      minWidth: {
        'button': '10.25rem',
      },
      maxHeight: {
        'card': '16.25rem',
      },
      borderWidth: {
        '1': '1px',
      },
      inset: {
        '1/10': '10%',
      },
      backgroundImage: {
        'card': "url('/src/asserts/card.png')",
      },
      backgroundColor: {
        'conmon': '#D9D9D9',
        'signUp': '#FFCBAD',
        'in': '#97E9B6',
        'mint': '#00B3E3',
        'stop': '#A4A9AD'
      },
      colors: {
        'baseColor': '#666666'
      }
    },

  },
  plugins: [
    require('@tailwindcss/forms')
  ]
}
