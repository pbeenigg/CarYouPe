import type { Config } from "tailwindcss";
import { themeColors, gradients, shadows, animations } from "./config/theme.js";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'accent': themeColors.primary,
        'space-black': {
          DEFAULT: themeColors.background.DEFAULT,
          light: themeColors.background.light,
          darker: themeColors.background.darker,
        },
        'metal-silver': {
          DEFAULT: themeColors.metal.silver,
          dark: themeColors.metal.darkSilver,
          light: themeColors.metal.lightSilver,
        },
        'card-bg': {
          DEFAULT: themeColors.card.DEFAULT,
          dark: themeColors.card.dark,
          lighter: themeColors.card.lighter,
        },
        'text': themeColors.text,
        'success': themeColors.status.success,
        'error': themeColors.status.error,
        'warning': themeColors.status.warning,
      },
      fontFamily: {
        sans: ['PingFang SC', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        'hero': ['48px', { lineHeight: '1.2', fontWeight: '700' }],
        'heading': ['36px', { lineHeight: '1.3', fontWeight: '600' }],
        'subheading': ['24px', { lineHeight: '1.4', fontWeight: '600' }],
        'body': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'small': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
      },
      boxShadow: {
        'glow': shadows.glow,
        'glow-lg': shadows.glowLg,
        'card': shadows.card,
        'card-hover': shadows.cardHover,
      },
      backgroundImage: {
        'gradient-accent': gradients.accent,
        'gradient-dark': gradients.dark,
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-in': 'slideIn 0.4s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        glowPulse: animations.glowPulse,
      },
    },
  },
  plugins: [],
};
export default config;
