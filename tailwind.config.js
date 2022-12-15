/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/flowbite/**/*.js"
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
      }
    },

  },
  plugins: [
    require('flowbite/plugin')
  ]
}
