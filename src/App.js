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
      main: '#2E4A6B',
      light: '#4A6FA5',
      dark: '#1A2B40',
    },
    secondary: {
      main: '#3B5998',
      light: '#5B7BC7',
      dark: '#2A3D6B',
    },
    background: {
      default: '#E8ECF4',
      paper: '#F5F7FA',
    },
    text: {
      primary: '#1A2332',
      secondary: '#3D4852',
    },
  },
  typography: {
    fontFamily: "'Inter', 'SF Pro Display', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 8px 25px rgba(46, 74, 107, 0.3)',
          },
        },
      },
    },
  },
});

// Home page component for the combined app
const HomePage = () => {
  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #D4DDE8 0%, #BCC8D6 30%, #A8B5C8 70%, #95A4BA 100%)',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 15% 40%, rgba(46, 74, 107, 0.15) 0%, transparent 60%),
          radial-gradient(circle at 85% 20%, rgba(59, 89, 152, 0.12) 0%, transparent 50%),
          radial-gradient(circle at 50% 90%, rgba(74, 111, 165, 0.1) 0%, transparent 60%),
          radial-gradient(circle at 20% 80%, rgba(42, 61, 107, 0.08) 0%, transparent 40%)
        `,
        zIndex: 1,
      },
    }}>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, pt: 4, pb: 6 }}>
        {/* Hero Section */}
        <Box sx={{ 
          textAlign: 'center',
          py: 6,
          px: 3,
          mb: 6,
          background: 'linear-gradient(135deg, rgba(245, 247, 250, 0.95) 0%, rgba(232, 236, 244, 0.9) 100%)',
          backdropFilter: 'blur(25px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 25px 45px rgba(46, 74, 107, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, transparent 0%, #2E4A6B 20%, #4A6FA5 40%, #3B5998 60%, #5B7BC7 80%, transparent 100%)',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: '1px',
            borderRadius: '23px',
            padding: '1px',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.6), rgba(255,255,255,0.1))',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'xor',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
          },
        }}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ 
            background: 'linear-gradient(135deg, #1A2332 0%, #2E4A6B 30%, #3B5998 70%, #2A3D6B 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            fontSize: { xs: '2rem', sm: '2.8rem', md: '3.2rem' },
            fontWeight: 800,
            letterSpacing: '-0.025em',
            mb: 2,
            textShadow: '0 2px 4px rgba(46, 74, 107, 0.1)',
          }}>
            OS Scheduling Visualizers
          </Typography>
          <Typography variant="h6" sx={{ 
            color: '#3D4852',
            mb: 4,
            maxWidth: '650px',
            mx: 'auto',
            fontSize: { xs: '1rem', sm: '1.1rem' },
            lineHeight: 1.5,
            fontWeight: 400,
          }}>
            Interactive visualizations to understand CPU and Disk scheduling algorithms with modern, real-time animations
          </Typography>
          
          {/* Animated floating elements */}
          <Box sx={{
            position: 'absolute',
            top: '15%',
            left: '8%',
            width: '65px',
            height: '65px',
            background: 'linear-gradient(45deg, #2E4A6B, #4A6FA5)',
            borderRadius: '16px',
            opacity: 0.2,
            animation: 'float 6s ease-in-out infinite',
            boxShadow: '0 8px 20px rgba(46, 74, 107, 0.3)',
          }} />
          <Box sx={{
            position: 'absolute',
            top: '65%',
            right: '12%',
            width: '45px',
            height: '45px',
            background: 'linear-gradient(45deg, #3B5998, #5B7BC7)',
            borderRadius: '50%',
            opacity: 0.25,
            animation: 'float 8s ease-in-out infinite reverse',
            boxShadow: '0 6px 15px rgba(59, 89, 152, 0.3)',
          }} />
        </Box>
        
        {/* Scheduler Cards */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ 
              p: 3, 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'linear-gradient(135deg, rgba(245, 247, 250, 0.9) 0%, rgba(232, 236, 244, 0.85) 100%)',
              backdropFilter: 'blur(25px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '20px',
              boxShadow: '0 20px 40px rgba(46, 74, 107, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(46, 74, 107, 0.03) 0%, rgba(74, 111, 165, 0.08) 100%)',
                zIndex: 1,
              },
              '& > *': {
                position: 'relative',
                zIndex: 2,
              },
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 30px 60px rgba(46, 74, 107, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
              },
            }}>
              <Box sx={{
                width: '80px',
                height: '80px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #2E4A6B 0%, #4A6FA5 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
                boxShadow: '0 12px 25px rgba(46, 74, 107, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              }}>
                <Typography sx={{ fontSize: '2rem', color: 'white' }}>⚡</Typography>
              </Box>
              <Typography variant="h4" gutterBottom sx={{ 
                color: '#1A2332',
                fontWeight: 700,
                mb: 3,
                textAlign: 'center',
              }}>
                CPU Scheduler
              </Typography>
              <Typography sx={{ 
                mb: 4, 
                textAlign: 'center',
                color: '#3D4852',
                lineHeight: 1.6,
                fontSize: '1.1rem',
              }}>
                Visualize how different CPU scheduling algorithms manage processes with interactive timelines and performance metrics
              </Typography>
              <Button 
                variant="contained" 
                component={Link} 
                to="cpu-scheduler"
                size="large"
                sx={{ 
                  mt: 'auto',
                  py: 2,
                  px: 4,
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  background: 'linear-gradient(135deg, #2E4A6B 0%, #4A6FA5 100%)',
                  boxShadow: '0 10px 25px rgba(46, 74, 107, 0.3)',
                  borderRadius: '12px',
                  '&:hover': {
                    boxShadow: '0 15px 35px rgba(46, 74, 107, 0.4)',
                    transform: 'translateY(-2px)',
                  },
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
              background: 'linear-gradient(135deg, rgba(245, 247, 250, 0.9) 0%, rgba(232, 236, 244, 0.85) 100%)',
              backdropFilter: 'blur(25px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '20px',
              boxShadow: '0 20px 40px rgba(59, 89, 152, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(59, 89, 152, 0.03) 0%, rgba(91, 123, 199, 0.08) 100%)',
                zIndex: 1,
              },
              '& > *': {
                position: 'relative',
                zIndex: 2,
              },
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 30px 60px rgba(59, 89, 152, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
              },
            }}>
              <Box sx={{
                width: '80px',
                height: '80px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #3B5998 0%, #5B7BC7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
                boxShadow: '0 12px 25px rgba(59, 89, 152, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              }}>
                <Typography sx={{ fontSize: '2rem', color: 'white' }}>💿</Typography>
              </Box>
              <Typography variant="h4" gutterBottom sx={{ 
                color: '#1A2332',
                fontWeight: 700,
                mb: 3,
                textAlign: 'center',
              }}>
                Disk Scheduler
              </Typography>
              <Typography sx={{ 
                mb: 4, 
                textAlign: 'center',
                color: '#3D4852',
                lineHeight: 1.6,
                fontSize: '1.1rem',
              }}>
                Explore disk scheduling algorithms and see how they optimize seek time and throughput in storage systems
              </Typography>
              <Button 
                variant="contained" 
                component={Link} 
                to="disk-scheduler"
                size="large"
                sx={{ 
                  mt: 'auto',
                  py: 2,
                  px: 4,
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  background: 'linear-gradient(135deg, #3B5998 0%, #5B7BC7 100%)',
                  boxShadow: '0 10px 25px rgba(59, 89, 152, 0.3)',
                  borderRadius: '12px',
                  '&:hover': {
                    boxShadow: '0 15px 35px rgba(59, 89, 152, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Launch Disk Scheduler
              </Button>
            </Paper>
          </Grid>
        </Grid>
        
        {/* Features Section */}
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ 
            color: '#1A2332',
            fontWeight: 700,
            mb: 4,
          }}>
            Why Choose Our Visualizers?
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{
                p: 3,
                background: 'linear-gradient(135deg, rgba(245, 247, 250, 0.8) 0%, rgba(232, 236, 244, 0.9) 100%)',
                backdropFilter: 'blur(25px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                height: '100%',
                boxShadow: '0 15px 30px rgba(46, 74, 107, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0 20px 40px rgba(46, 74, 107, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                },
              }}>
                <Typography variant="h6" sx={{ color: '#1A2332', mb: 2, fontWeight: 600 }}>
                  🎯 Interactive Learning
                </Typography>
                <Typography sx={{ color: '#3D4852' }}>
                  Step through algorithms with real-time visualizations and detailed explanations
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{
                p: 3,
                background: 'linear-gradient(135deg, rgba(245, 247, 250, 0.8) 0%, rgba(232, 236, 244, 0.9) 100%)',
                backdropFilter: 'blur(25px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                height: '100%',
                boxShadow: '0 15px 30px rgba(46, 74, 107, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0 20px 40px rgba(46, 74, 107, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                },
              }}>
                <Typography variant="h6" sx={{ color: '#1A2332', mb: 2, fontWeight: 600 }}>
                  📊 Performance Metrics
                </Typography>
                <Typography sx={{ color: '#3D4852' }}>
                  Compare algorithms with detailed performance statistics and efficiency metrics
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{
                p: 3,
                background: 'linear-gradient(135deg, rgba(245, 247, 250, 0.8) 0%, rgba(232, 236, 244, 0.9) 100%)',
                backdropFilter: 'blur(25px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                height: '100%',
                boxShadow: '0 15px 30px rgba(46, 74, 107, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0 20px 40px rgba(46, 74, 107, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                },
              }}>
                <Typography variant="h6" sx={{ color: '#1A2332', mb: 2, fontWeight: 600 }}>
                  🔧 Customizable
                </Typography>
                <Typography sx={{ color: '#3D4852' }}>
                  Input your own process parameters and see how different scenarios affect performance
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
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
        background: 'linear-gradient(135deg, rgba(245, 247, 250, 0.95) 0%, rgba(232, 236, 244, 0.9) 100%)',
        backdropFilter: 'blur(25px)',
        color: '#3D4852',
        borderTop: '1px solid rgba(255, 255, 255, 0.3)',
        position: 'relative',
        boxShadow: '0 -8px 20px rgba(46, 74, 107, 0.04)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, #2E4A6B 20%, #4A6FA5 40%, #3B5998 60%, #5B7BC7 80%, transparent 100%)',
          opacity: 0.5,
        },
      }}
    >
      <Container maxWidth="md">
        <Typography variant="body2" sx={{ 
          fontSize: '0.8rem', 
          letterSpacing: '0.3px',
          fontWeight: 500,
          color: '#1A2332',
        }}>
          © {new Date().getFullYear()} OS Scheduling Visualizers - Created for educational purposes
        </Typography>
        <Typography variant="body2" sx={{ 
          fontSize: '0.7rem', 
          color: '#3D4852',
          mt: 0.5,
        }}>
          Built with React & Material-UI
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