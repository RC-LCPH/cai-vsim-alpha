import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// Define custom breakpoints to better handle small devices
const customBreakpoints = {
  values: {
    xs: 0,      // Extra small devices (phones)
    xxs: 320,   // Very small phones (iPhone SE)
    sm: 600,    // Small devices (tablets)
    md: 960,    // Medium devices (small laptops)
    lg: 1280,   // Large devices (desktops)
    xl: 1920,   // Extra large devices
  },
};

// Create responsive theme
let theme = createTheme({
  // Custom breakpoints
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960, 
      lg: 1280,
      xl: 1920,
    },
  },
  // Custom palette
  palette: {
    primary: {
      main: '#1976d2', // Blue
      light: '#4791db',
      dark: '#115293',
    },
    secondary: {
      main: '#388e3c', // Green
      light: '#5eae60',
      dark: '#276228',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  // Customize typography
  typography: {
    fontFamily: [
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Arial',
      'sans-serif',
    ].join(','),
    // Adjust font sizes for very small screens
    caption: {
      fontSize: '0.7rem',
    },
    body2: {
      fontSize: '0.8rem',
      '@media (max-width:600px)': {
        fontSize: '0.75rem',
      },
    },
    button: {
      textTransform: 'none', // Don't force uppercase on buttons
    },
  },
  // Customize shape
  shape: {
    borderRadius: 8,
  },
});

// Make typography responsive
theme = responsiveFontSizes(theme);

export default theme; 