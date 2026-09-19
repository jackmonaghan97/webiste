// Monokai palette. The pages use Tailwind's slate / sky / white utilities, which are
// remapped here so one edit changes the whole site.
tailwind.config = {
  theme: {
    extend: {
      colors: {
        slate: {
          200: '#f8f8f2',   // brightest text
          300: '#e6e6df',
          400: '#c4c3b5',   // body text
          500: '#a09f90',   // secondary text
          600: '#75715e',   // Monokai comment grey
          700: '#5b5a4b',
          800: '#49483e',   // borders
          900: '#3e3d32',   // panels
          950: '#272822',   // page background
        },
        sky: { 300: '#66d9ef', 400: '#66d9ef', 500: '#66d9ef' },
        white: '#f8f8f2',
        ink: '#272822',
        panel: '#3e3d32',
        line: '#49483e',
        accent: '#66d9ef',   // Monokai cyan: links
        green: { DEFAULT: '#a6e22e' },
        orange: { DEFAULT: '#fd971f' },
        pink: { DEFAULT: '#f92672' },
        yellow: { DEFAULT: '#e6db74' },
        purple: { DEFAULT: '#ae81ff' },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
}
