/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // NOUVELLE PALETTE ORGANIQUE COMPLÈTE
        // Vert - Dominante (fraîcheur)
        'green-soft': '#a7d397',
        'green-light': '#c6e6b3',
        'green-medium': '#5a8c5a',
        'forest-dark': '#2c5530',
        
        // Terre cuite - Secondaire (proximité)
        'terracotta': {
          DEFAULT: '#d2691e',
          30: '#fefaf5',
          50: '#fdf5f0',
          100: '#fbebe1',
          200: '#f7d8c3',
          300: '#f3c4a5',
          400: '#efb187',
          500: '#eb9e69',
          600: '#bc7e54',
          700: '#8d5f3f',
        },
        'terracotta-light': '#e38d4a',
        'terracotta-soft': '#f0c9a7',
        
        // Crème/Naturel (confiance)
        'cream-light': '#f8f4e9',
        'cream-medium': '#e8e0d0',
        'cream-dark': '#d4c9b8',

        // Compatibilité couleurs custom utilisées dans les vues/modules
        'forest-green': {
          DEFAULT: '#2f7738',
          50: '#f0f7ef',
          100: '#d9ebd6',
          200: '#b4d8ad',
          300: '#8cc583',
          400: '#64aa64',
          500: '#3f8f47',
          600: '#2f7738',
          700: '#245d2d',
          800: '#1b4521',
          900: '#112d16',
        },
        'forest': {
          25: '#f7faf7',
          30: '#fbfdfb',
          50: '#f0f7f0',
          100: '#e0eee0',
          200: '#c1ddc1',
          300: '#a2cca2',
          400: '#83bb83',
          500: '#64aa64',
          600: '#508850',
          700: '#3c663c',
          800: '#284428',
        },
        'cream': {
          40: '#fefdf5',
          50: '#fefaf0',
          100: '#fdf5e1',
          200: '#fbebc3',
        },
        'nature-gray': '#666666',
        'natural-gray': '#666666',
        'soft-green': '#66bb6a',
        'earth-brown': '#8d6e63',
        'success-light': '#c8e6c9',
        'success-dark': '#2e7d32',
        'warning-light': '#fff9c4',
        'warning-dark': '#f57f17',
        'info-light': '#b3e5fc',
        'info-dark': '#0288d1',
        'error-light': '#ffcdd2',
        'error-dark': '#c62828',
        
        // Palette "fresh" complète basée sur la nouvelle identité
        'fresh': {
          50: '#f8faf6',
          100: '#f1f7ed',
          200: '#e4eeda',
          300: '#c6e6b3',
          400: '#a7d397',
          500: '#5a8c5a',
          600: '#528f50',
          700: '#2c5530',
          800: '#1e3a22',
          900: '#0f1d11',
          950: '#070f08',
        },
        
        // Palette "earth" complète basée sur terracotta
        'earth': {
          50: '#fdf9f5',
          100: '#fcf1e6',
          200: '#f9e0c7',
          300: '#f5ca9d',
          400: '#f0b374',
          500: '#d2691e', // terracotta principal
          600: '#b85a1a',
          700: '#9e4b16',
          800: '#843c12',
          900: '#6a2d0e',
          950: '#501e0a',
        },
        
        // Palette "nature" complète
        'nature': {
          50: '#f8faf6',
          100: '#f1f7ed',
          200: '#e4eeda',
          300: '#c6e6b3',
          400: '#a7d397',
          500: '#5a8c5a',
          600: '#528f50',
          700: '#2c5530',
          800: '#1e3a22',
          900: '#0f1d11',
          950: '#070f08',
        },
        
        // Accents spécifiques
        'accent-orange': '#dfba41',
        'accent-bio': '#5a8c5a',
        'accent-local': '#d2691e',
        'accent-season': '#dfba41',
        
        // Compatibilité avec couleurs existantes
        'bio': '#5a8c5a', // aligné avec green-medium
        'primary': '#5a8c5a',
        'secondary': '#d2691e',
        'accent': '#118ab2',
        
        // Palette sky/blue pour variété
        'sky': {
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        
        'blue': {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      
      backgroundImage: {
        // Dégradés organiques principaux
        'gradient-nature': 'linear-gradient(135deg, rgba(248, 244, 233, 0.9) 0%, rgba(255, 255, 255, 0.85) 50%, rgba(198, 230, 179, 0.1) 100%)',
        'gradient-forest': 'linear-gradient(135deg, rgba(44, 85, 48, 0.9) 0%, rgba(90, 140, 90, 0.8) 100%)',
        'gradient-vert': 'linear-gradient(135deg, #a7d397 0%, #c6e6b3 100%)',
        'gradient-terre': 'linear-gradient(135deg, #e38d4a 0%, #f0c9a7 100%)',
        'gradient-naturel': 'linear-gradient(135deg, #f8f4e9 0%, #ffffff 100%)',
        
        // Dégradés de compatibilité
        'gradient-bio': 'linear-gradient(to right, #5a8c5a, #a7d397)',
        'gradient-earth': 'linear-gradient(to right, #d2691e, #e38d4a)',
        'gradient-orange': 'linear-gradient(to right, #dfba41, #f0c9a7)',
        
        // Textures et motifs organiques
        'paper-texture': "url('data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\" fill=\"%235a8c5a\" fill-opacity=\"0.03\" fill-rule=\"evenodd\"/%3E%3C/svg%3E')",
        'leaf-pattern': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%235a8c5a\" fill-opacity=\"0.03\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
        'grid-pattern': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%235a8c5a\" fill-opacity=\"0.05\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
      },
      
      boxShadow: {
        // Ombres organiques
        'organic': '0 10px 40px rgba(44, 85, 48, 0.1), 0 2px 10px rgba(167, 211, 151, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
        'organic-hover': '0 20px 60px rgba(44, 85, 48, 0.15), 0 8px 25px rgba(167, 211, 151, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
        
        // Ombres de compatibilité
        'soft': '0 4px 20px rgba(44, 85, 48, 0.08)',
        'medium': '0 8px 30px rgba(44, 85, 48, 0.12)',
        'float': '0 20px 60px rgba(0, 0, 0, 0.1)',
        'glow-green': '0 0 20px rgba(167, 211, 151, 0.3)',
      },
      
      animation: {
        // Animations organiques
        'slide-in-up': 'slideInUp 0.5s ease-out',
        'slide-in-down': 'slide-in-down 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'fade-in': 'fadeIn 0.3s ease-in',
        'pulse-soft': 'pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-delay-1': 'float-delay-1 6s ease-in-out infinite',
        'float-delay-2': 'float-delay-2 8s ease-in-out infinite',
        'float-fast': 'float-fast 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite linear',
        'float-leaves': 'float-leaves 20s ease-in-out infinite',
        'subtle-pulse': 'subtle-pulse 3s ease-in-out infinite',
        'gentle-glow': 'gentle-glow 4s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-soft': 'bounce 1.5s ease-in-out infinite',
        'spin-slow': 'spin 2s linear infinite',
      },
      
      transitionTimingFunction: {
        'organic': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'naturel': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'gentle': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      
      keyframes: {
        // Keyframes organiques
        slideInUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-in-down': {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'float-delay-1': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-15px) rotate(180deg)' },
        },
        'float-delay-2': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-25px) rotate(-180deg)' },
        },
        'float-fast': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-15px) rotate(10deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'float-leaves': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '25%': { transform: 'translateY(-10px) rotate(-1deg)' },
          '75%': { transform: 'translateY(5px) rotate(1deg)' },
        },
        'subtle-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'gentle-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(167, 211, 151, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(167, 211, 151, 0.5)' },
        },
      },
      
      fontFamily: {
        'display': ['Inter', 'system-ui', 'sans-serif'],
        'organic': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'serif': ['Playfair Display', 'serif'],
        'script': ['Dancing Script', 'cursive'],
      },
      
      // Extensions supplémentaires
      backdropBlur: {
        'xs': '2px',
      },
      backgroundSize: {
        '20': '20px 20px',
        '200': '200px 200px',
        '60': '60px 60px',
      },
    },
  },
  plugins: [],
}
