/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        // CoinEstate Brand Colors - German Corporate Identity
        primary: {
          50: '#faf5ff',   // Very light purple for backgrounds
          100: '#f3e8ff',  // Light purple for subtle highlights
          200: '#e9d5ff',  // Soft purple for hover states
          300: '#d8b4fe',  // Medium purple for disabled states
          400: '#c084fc',  // Purple accent
          500: '#4A154B',  // Main CoinEstate Purple - Professional & trustworthy
          600: '#3d1140',  // Darker purple for hover states
          700: '#2f0d35',  // Dark purple for text
          800: '#22092a',  // Very dark purple
          900: '#14051f',  // Almost black purple
        },
        secondary: {
          50: '#fef2f2',   // Very light red for backgrounds
          100: '#fee2e2',  // Light red for alerts
          200: '#fecaca',  // Soft red for warnings
          300: '#fca5a5',  // Medium red for highlights
          400: '#f87171',  // Light accent red
          500: '#E01E5A',  // CoinEstate Accent Red - Energy & action
          600: '#dc2626',  // Standard red
          700: '#b91c1c',  // Darker red for hover
          800: '#991b1b',  // Dark red for text
          900: '#7f1d1d',  // Very dark red
        },
        accent: {
          50: '#fffbeb',   // Very light gold for backgrounds
          100: '#fef3c7',  // Light gold for highlights
          200: '#fde68a',  // Soft gold for buttons
          300: '#fcd34d',  // Medium gold for accents
          400: '#fbbf24',  // Gold warning color
          500: '#ECB22E',  // CoinEstate Gold - Success & premium feel
          600: '#d97706',  // Darker gold
          700: '#b45309',  // Bronze tone
          800: '#92400e',  // Dark bronze
          900: '#78350f',  // Very dark bronze
        },
        // Professional German Corporate Grays
        gray: {
          50: '#f9fafb',   // Almost white
          100: '#f3f4f6',  // Very light gray - perfect for backgrounds
          200: '#e5e7eb',  // Light gray for borders
          300: '#d1d5db',  // Medium light gray
          400: '#9ca3af',  // Medium gray - perfect for text
          500: '#6b7280',  // Standard gray
          600: '#4b5563',  // Dark gray for headings
          700: '#374151',  // Very dark gray
          800: '#1f2937',  // Almost black for text
          850: '#1a202c',  // Custom dark gray
          900: '#111827',  // Very dark
          950: '#0d1117',  // Almost black
        },
        // Success/Error States for German compliance messaging
        success: {
          50: '#f0fdf4',
          500: '#22c55e',
          700: '#15803d',
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          700: '#b45309',
        },
        error: {
          50: '#fef2f2',
          500: '#ef4444',
          700: '#c53030',
        },
        // Special colors for legal compliance indicators
        legal: {
          compliant: '#22c55e',   // Green for compliant elements
          warning: '#f59e0b',     // Orange for attention items  
          restricted: '#ef4444',   // Red for forbidden elements
        }
      },
      fontFamily: {
        // Professional German business font stack
        sans: ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'system-ui', 'sans-serif'],
        // Keep existing mono font for code
        mono: ['SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'monospace'],
        // Add serif for legal documents
        serif: ['Georgia', 'Times New Roman', 'serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      animation: {
        // Professional animations suitable for German corporate identity
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'scale-in': 'scaleIn 0.2s ease-out',
        'scale-out': 'scaleOut 0.2s ease-in',
        // New: Professional glow effect for CoinEstate brand
        'glow': 'glow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        scaleOut: {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.9)' },
        },
        // New: Professional glow effect matching CoinEstate brand
        glow: {
          'from': { 'box-shadow': '0 0 10px rgba(224, 30, 90, 0.3)' },
          'to': { 'box-shadow': '0 0 20px rgba(224, 30, 90, 0.6), 0 0 30px rgba(236, 178, 46, 0.3)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-pattern': "url('/images/hero-pattern.svg')",
        'noise': "url('/images/noise.png')",
        // New: CoinEstate brand gradients
        'coinestate-gradient': 'linear-gradient(135deg, #4A154B 0%, #E01E5A 50%, #ECB22E 100%)',
        'coinestate-subtle': 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.5)',
        'glow-purple': '0 0 20px rgba(168, 85, 247, 0.5)',
        'inner-lg': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.1)',
        // New: CoinEstate brand shadows
        'coinestate-glow': '0 0 20px rgba(224, 30, 90, 0.3)',
        'coinestate-card': '0 10px 40px rgba(0, 0, 0, 0.1)',
        'coinestate-hover': '0 20px 60px rgba(0, 0, 0, 0.15)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      minHeight: {
        'screen-75': '75vh',
        'screen-80': '80vh',
        'screen-85': '85vh',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      scale: {
        '102': '1.02',
        '103': '1.03',
      },
      rotate: {
        '1': '1deg',
        '2': '2deg',
        '3': '3deg',
      },
      skew: {
        '1': '1deg',
        '2': '2deg',
        '3': '3deg',
      },
      letterSpacing: {
        'extra-wide': '0.2em',
      },
      lineHeight: {
        '12': '3rem',
        '14': '3.5rem',
        '16': '4rem',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '900': '900ms',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'ease-in-expo': 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
        'ease-out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    // Enhanced glassmorphism for professional German corporate design
    function({ addUtilities }) {
      const newUtilities = {
        '.glass': {
          'background': 'rgba(255, 255, 255, 0.05)',
          'backdrop-filter': 'blur(10px)',
          'border': '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.glass-dark': {
          'background': 'rgba(0, 0, 0, 0.05)',
          'backdrop-filter': 'blur(10px)',
          'border': '1px solid rgba(0, 0, 0, 0.1)',
        },
        // New: Professional glass effect for CoinEstate
        '.glass-coinestate': {
          'background': 'rgba(255, 255, 255, 0.1)',
          'backdrop-filter': 'blur(10px)',
          'border': '1px solid rgba(74, 21, 75, 0.2)',
        },
        '.text-shadow': {
          'text-shadow': '0 2px 4px rgba(0, 0, 0, 0.5)',
        },
        '.text-shadow-lg': {
          'text-shadow': '0 4px 8px rgba(0, 0, 0, 0.5)',
        },
      }
      addUtilities(newUtilities)
    },
    // Professional scrollbar styling suitable for German corporate identity
    function({ addUtilities }) {
      const scrollbarUtilities = {
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
          'scrollbar-color': '#4B5563 #1F2937',
        },
        '.scrollbar-coinestate': {
          'scrollbar-width': 'thin',
          'scrollbar-color': '#4A154B #f3f4f6',
        },
        '.scrollbar-webkit': {
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f3f4f6',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#4A154B',
            'border-radius': '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#E01E5A',
          },
        },
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      }
      addUtilities(scrollbarUtilities)
    },
  ],
  // Switch to light mode as default for professional German corporate identity
  darkMode: 'class',
  future: {
    hoverOnlyWhenSupported: true,
  },
  experimental: {
    optimizeUniversalDefaults: true,
  },
}
