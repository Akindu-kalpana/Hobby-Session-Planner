// centralized configuration for the app
// change colors and settings here once, applies everywhere

const config = {
  // API base URL
  API_URL: 'http://localhost:5000/api',
  
  // colors theme
  colors: {
    primary: '#4F46E5',      // main color (indigo)
    secondary: '#10B981',    // success/green
    danger: '#EF4444',       // delete/error red
    warning: '#F59E0B',      // warning orange
    dark: '#1F2937',         // dark gray
    light: '#F3F4F6',        // light gray
    white: '#FFFFFF',
    text: '#374151',         // text color
  },
  
  // app settings
  dateFormat: 'YYYY-MM-DD',
};

export default config;