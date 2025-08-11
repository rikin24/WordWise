/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],  theme: {
    extend: {
      colors: {
        // Base colors
        'midnight-blue': '#000048',
        'white': '#FFFFFF',
        
        // Plum accents (Accent 1)
        'dark-plum': '#2E308E',
        'medium-plum': '#7373D8',
        'light-plum': '#85A0F9',
        
        // Blue accents (Accent 2)
        'dark-blue': '#2F78C4',
        'medium-blue': '#6AA2DC',
        'light-blue': '#92BBE6',
        
        // Teal accents (Accent 3)
        'dark-teal': '#05819B',
        'medium-teal': '#06C7CC',
        'light-teal': '#26EFE9',
        
        // Grays (Secondary colors)
        'dark-gray': '#53565A',
        'medium-gray': '#97999B',
        'light-gray': '#D0D0CE',
        
        // Legacy support for existing components
        primary: {
          50: '#85A0F9',
          100: '#7373D8',
          200: '#6AA2DC',
          300: '#2F78C4',
          400: '#2E308E',
          500: '#000048',
          600: '#000048',
          700: '#000048',
          800: '#000048',
          900: '#000048',
        },
        accent: {
          50: '#26EFE9',
          100: '#06C7CC',
          200: '#05819B',
          300: '#05819B',
          400: '#05819B',
          500: '#05819B',
          600: '#05819B',
          700: '#05819B',
          800: '#05819B',
          900: '#701a75',
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' }
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #3b82f6' },
          '100%': { boxShadow: '0 0 20px #3b82f6, 0 0 30px #3b82f6' }
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
