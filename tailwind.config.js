/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [],
  purge: [
    './resources/views/**/*.edge',
    './resources/css/**/*.css',
    './resources/js/**/*.js',
    './resources/js/**/*.ts',
  ],
  theme: {
    extend: {
      keyframes: {
        'slide-from-right': {
          '0%': {
            'transform': 'translateX(100%)',
            'opacity': '0.2',
            'animation-timing-function': 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '100%': {
            'transform': 'translateX(0)',
            'opacity': '1',
            'animation-timing-function': 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
      },
      animation: {
        'slide-from-right': 'slide-from-right 0.5s ease-in-out',
      },
    },
  },
  plugins: [],
}
