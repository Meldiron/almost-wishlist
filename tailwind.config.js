/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'primary': {
          '50': '#f4faf3',
          '100': '#e4f4e4',
          '200': '#cce7cb',
          '300': '#a3d3a2',
          '400': '#73b771',
          '500': '#509a4d',
          '600': '#3d7e3b',
          '700': '#326431',
          '800': '#2c502b',
          '900': '#1f381f',
          '950': '#102310',
        },
      }
    },
  },
  plugins: [],
}

