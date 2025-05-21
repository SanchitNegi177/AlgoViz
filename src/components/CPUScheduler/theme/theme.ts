import { createTheme } from '@mui/material/styles';

// New color palette inspired by the reference image
const theme = createTheme({
  palette: {
    primary: {
      main: '#3D52A0', // Deep blue from the reference image
      light: '#7091E6',
      dark: '#2C3E7B',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#ADB8DA', // Lighter blue for secondary elements
      light: '#C8D1F0',
      dark: '#8590B3',
      contrastText: '#2C3E7B',
    },
    error: {
      main: '#ED8B8B', // Softer red
      light: '#FFB0B0',
      dark: '#C55F5F',
    },
    warning: {
      main: '#FFCB77', // Warm yellow
      light: '#FFDF9F',
      dark: '#E0A84E',
    },
    info: {
      main: '#8DE8FF', // Light blue
      light: '#B2F0FF',
      dark: '#5CCDEB',
    },
    success: {
      main: '#A0E7AD', // Soft green
      light: '#C0F5C7',
      dark: '#72C383',
    },
    background: {
      default: '#F0F3FB', // Light blue-gray background
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2F3746', // Dark blue-gray
      secondary: '#546080', // Medium blue-gray
      disabled: '#ADB8DA',
    },
    divider: 'rgba(61, 82, 160, 0.12)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(61, 82, 160, 0.18)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 6px 16px rgba(61, 82, 160, 0.25)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(61, 82, 160, 0.08)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

export default theme; 