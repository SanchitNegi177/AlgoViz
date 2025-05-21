import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Container, Box, Typography, Button, Grid, Paper } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Import Scheduler Apps
import CPUSchedulerApp from './components/CPUScheduler/App';
import DiskSchedulerApp from './components/DiskScheduler/App';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2F4BBF',
    },
    secondary: {
      main: '#0069C0',
    },
    background: {
      default: '#f9f9fa',
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
  },
});

// Home page component for the combined app
const HomePage = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ 
        textAlign: 'center',
        py: 6,
        px: 2,
        my: 2,
        background: 'linear-gradient(135deg, #EDF1FF 0%, #C1CCFF 100%)',
        borderRadius: '16px',
        boxShadow: '0 8px 40px rgba(47, 75, 191, 0.15)',
      }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ 
          color: '#1D3080',
          fontSize: { xs: '2rem', sm: '3rem' }
        }}>
          Operating System Scheduling Visualizers
        </Typography>
        <Typography variant="h5" sx={{ 
          color: '#435180',
          mb: 4,
          maxWidth: '800px',
          mx: 'auto',
          fontSize: { xs: '1.1rem', sm: '1.5rem' }
        }}>
          Interactive visualizations to understand CPU and Disk scheduling algorithms
        </Typography>
      </Box>
      
      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ 
            p: 3, 
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #E1E7FF 0%, #C1CCFF 100%)',
            border: '1px solid rgba(159, 174, 240, 0.3)',
            boxShadow: '0 8px 30px rgba(47, 75, 191, 0.12)',
            borderRadius: '12px',
          }}>
            <Typography variant="h4" gutterBottom sx={{ 
              color: '#1D3080',
              fontWeight: 600,
              mb: 3
            }}>
              CPU Scheduler
            </Typography>
            <Typography sx={{ 
              mb: 3, 
              textAlign: 'center',
              color: '#435180'
            }}>
              Understand how different CPU scheduling algorithms work with interactive visualizations
            </Typography>
            <Button 
              variant="contained" 
              component={Link} 
              to="cpu-scheduler"
              size="large"
              sx={{ 
                mt: 'auto',
                py: 1.5,
                px: 4,
                fontWeight: 600,
                background: 'linear-gradient(90deg, #1D3080 0%, #5A7CFF 100%)',
                boxShadow: '0 8px 20px rgba(47, 75, 191, 0.25)',
                '&:hover': {
                  boxShadow: '0 12px 24px rgba(47, 75, 191, 0.35)',
                }
              }}
            >
              Launch CPU Scheduler
            </Button>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ 
            p: 3, 
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #D8F2FF 0%, #A9E0FF 100%)',
            border: '1px solid rgba(0, 157, 224, 0.3)',
            boxShadow: '0 8px 30px rgba(0, 105, 192, 0.12)',
            borderRadius: '12px',
          }}>
            <Typography variant="h4" gutterBottom sx={{ 
              color: '#004C8C',
              fontWeight: 600,
              mb: 3
            }}>
              Disk Scheduler
            </Typography>
            <Typography sx={{ 
              mb: 3, 
              textAlign: 'center',
              color: '#006DB3'
            }}>
              Explore how different disk scheduling algorithms optimize read/write operations
            </Typography>
            <Button 
              variant="contained" 
              component={Link} 
              to="disk-scheduler"
              size="large"
              sx={{ 
                mt: 'auto',
                py: 1.5,
                px: 4,
                fontWeight: 600,
                background: 'linear-gradient(90deg, #004C8C 0%, #0069C0 100%)',
                boxShadow: '0 8px 20px rgba(0, 105, 192, 0.25)',
                '&:hover': {
                  boxShadow: '0 12px 24px rgba(0, 105, 192, 0.35)',
                }
              }}
            >
              Launch Disk Scheduler
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

// Footer component
const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 2,
        mt: 'auto',
        textAlign: 'center',
        background: 'linear-gradient(90deg, #2F4BBF 0%, #0069C0 100%)',
        color: 'white',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <Container maxWidth="md">
        <Typography variant="body2" sx={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}>
          © {new Date().getFullYear()} - Created for educational purposes
        </Typography>
      </Container>
    </Box>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cpu-scheduler/*" element={<CPUSchedulerApp />} />
            <Route path="/disk-scheduler/*" element={<DiskSchedulerApp />} />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}

export default App; 