/** @type {import('tailwindcss').Config} */

module.exports = {
  future: {
    purgeLayersByDefault: true
  },
  purge: {
    layers: ['utilities'],
    content: [
      './src/**/*.js',
      './src/**/*.vue'
    ]
  },
  theme: {
    extend: {
      screens: {
        '2xl': '1390px'
      },
      maxWidth: {
        'screen-2xl': '1390px'
      }
    }
  },
  variants: {},
  plugins: []
}
