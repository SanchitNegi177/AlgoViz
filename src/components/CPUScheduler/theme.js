import { createTheme } from '@mui/material/styles';

// Enhanced color palette with more vibrant colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#2F4BBF', // Deeper, more saturated blue
      light: '#5A7CFF', // Brighter light blue
      dark: '#1D3080', // Rich dark blue
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#9FAEF0', // More saturated secondary blue
      light: '#C1CCFF', // Brighter light secondary
      dark: '#7886C8', // More vibrant dark secondary
      contrastText: '#1D3080',
    },
    error: {
      main: '#FF6B6B', // More vibrant red
      light: '#FF9E9E',
      dark: '#D14545',
    },
    warning: {
      main: '#FFAB40', // More vibrant orange/yellow
      light: '#FFCD80',
      dark: '#E08C1B',
    },
    info: {
      main: '#42DDFF', // Brighter cyan
      light: '#8CEBFF',
      dark: '#00B2DD',
    },
    success: {
      main: '#65D587', // Brighter green
      light: '#A0F0B4',
      dark: '#359A57',
    },
    background: {
      default: '#EDF1FF', // Slightly more colorful background
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1F2A4B', // Deeper, more saturated text
      secondary: '#435180', // More vibrant secondary text
      disabled: '#9FAEF0',
    },
    divider: 'rgba(47, 75, 191, 0.25)',
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
            boxShadow: '0 4px 12px rgba(47, 75, 191, 0.25)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 6px 16px rgba(47, 75, 191, 0.35)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(47, 75, 191, 0.12)',
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
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
  },
});

export default theme; 