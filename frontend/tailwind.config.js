export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#F8B500',      // Blinkit-like yellow/orange
        'primary-dark': '#E6A300',
        'secondary': '#2B3139',    // Dark text
        'accent': '#00C851',       // Success green
        'warning': '#FF6B35',      // Alert orange
        'background': '#FAFAFA',   // Light gray background
        'surface': '#FFFFFF',      // White surface
        'border': '#E5E7EB',       // Light border
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -2px rgba(0, 0, 0, 0.1), 0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.4s ease-in',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
    },
  },
  plugins: [],
}
