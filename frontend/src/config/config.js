// centralized configuration for the app
// change colors and settings here once, applies everywhere

const config = {
  // API base URL
  API_URL: 'http://localhost:5000/api',
  
  // elegant green & gold color theme
  colors: {
    primary: '#059669',      // forest green
    secondary: '#10B981',    // emerald green
    accent: '#D97706',       // gold/amber
    danger: '#DC2626',       // red for delete
    warning: '#F59E0B',      // orange warning
    dark: '#1F2937',         // dark gray
    darkGreen: '#064E3B',    // very dark green
    light: '#F3F4F6',        // light gray
    lightGreen: '#D1FAE5',   // light green tint
    white: '#FFFFFF',
    text: '#374151',         // text color
    gold: '#FCD34D',         // lighter gold
  },
  
  // app settings
  dateFormat: 'YYYY-MM-DD',
};

export default config;