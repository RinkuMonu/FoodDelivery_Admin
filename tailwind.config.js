/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f1ff',
          100: '#cce3ff',
          200: '#99c7ff',
          300: '#66abff',
          400: '#338fff',
          500: '#0073ff', // Main primary color
          600: '#005cd9',
          700: '#0046b3',
          800: '#002f8c',
          900: '#001966',
        },
        accent: {
          50: '#fef9e6',
          100: '#fef2cc',
          200: '#fde599',
          300: '#fbd966',
          400: '#facc33',
          500: '#f9c000', // Main accent color
          600: '#d4a500',
          700: '#b08900',
          800: '#8d6d00',
          900: '#695100',
        },
        success: {
          50: '#e6f7ef',
          100: '#ccf0df',
          200: '#99e0bf',
          300: '#66d19f',
          400: '#33c17f',
          500: '#00b25f', // Main success color
          600: '#009751',
          700: '#007c42',
          800: '#006234',
          900: '#004726',
        },
        warning: {
          50: '#fef3e6',
          100: '#fde7cc',
          200: '#fbcf99',
          300: '#f9b866',
          400: '#f7a033',
          500: '#f58800', // Main warning color
          600: '#d17300',
          700: '#ad5f00',
          800: '#894b00',
          900: '#653600',
        },
        error: {
          50: '#fce6e6',
          100: '#f9cccc',
          200: '#f39999',
          300: '#ed6666',
          400: '#e73333',
          500: '#e10000', // Main error color
          600: '#c00000',
          700: '#9f0000',
          800: '#7f0000',
          900: '#5f0000',
        },
      },
      boxShadow: {
        card: '0 2px 8px 0 rgba(0, 0, 0, 0.08)',
        dropdown: '0 4px 12px 0 rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};