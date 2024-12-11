import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        'scroll': 'scroll 40s linear infinite',
        'scroll-reverse': 'scroll-reverse 40s linear infinite',
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(calc(-250px * 6))' },
        },
        'scroll-reverse': {
          '0%': { transform: 'translateX(calc(-250px * 6))' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        primary: '#21336a',
        'primary-light': '#2a4087',
      },
      fontFamily: {
        sans: ['OpenSans', 'sans-serif'],
      }
      
    },
  },
  plugins: [],
};

export default config;
