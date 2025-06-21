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
      main: '#2D4A8F',
      light: '#4A6EC7',
      dark: '#1A2B5C',
    },
    secondary: {
      main: '#6B46C1',
      light: '#8B5CF6',
      dark: '#553C9A',
    },
    background: {
      default: '#E0E7FF',
      paper: '#EEF2FF',
    },
    text: {
      primary: '#1E1B4B',
      secondary: '#4C1D95',
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
            boxShadow: '0 8px 25px rgba(45, 74, 143, 0.35)',
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
      background: 'linear-gradient(135deg, #A5B4FC 0%, #818CF8 20%, #6366F1 40%, #8B5CF6 60%, #A855F7 80%, #C084FC 100%)',
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
          radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.25) 0%, transparent 60%),
          radial-gradient(circle at 80% 15%, rgba(99, 102, 241, 0.22) 0%, transparent 50%),
          radial-gradient(circle at 50% 85%, rgba(168, 85, 247, 0.2) 0%, transparent 65%),
          radial-gradient(circle at 15% 70%, rgba(129, 140, 248, 0.18) 0%, transparent 45%),
          radial-gradient(circle at 85% 60%, rgba(192, 132, 252, 0.15) 0%, transparent 50%)
        `,
        zIndex: 1,
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(180deg, rgba(165, 180, 252, 0.1) 0%, rgba(192, 132, 252, 0.15) 100%)',
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
          background: 'linear-gradient(135deg, rgba(238, 242, 255, 0.95) 0%, rgba(224, 231, 255, 0.92) 50%, rgba(219, 234, 254, 0.9) 100%)',
          backdropFilter: 'blur(30px)',
          borderRadius: '24px',
          border: '2px solid rgba(255, 255, 255, 0.5)',
          boxShadow: '0 25px 50px rgba(99, 102, 241, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, transparent 0%, #8B5CF6 15%, #6366F1 30%, #8B5CF6 45%, #A855F7 60%, #C084FC 75%, transparent 100%)',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: '2px',
            borderRadius: '22px',
            padding: '2px',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(224, 231, 255, 0.4))',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'xor',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
          },
        }}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ 
            background: 'linear-gradient(135deg, #1E1B4B 0%, #2D4A8F 25%, #6B46C1 50%, #8B5CF6 75%, #A855F7 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            fontSize: { xs: '2rem', sm: '2.8rem', md: '3.2rem' },
            fontWeight: 800,
            letterSpacing: '-0.025em',
            mb: 2,
            textShadow: '0 2px 4px rgba(99, 102, 241, 0.2)',
          }}>
            OS Scheduling Visualizers
          </Typography>
          <Typography variant="h6" sx={{ 
            color: '#4C1D95',
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
            top: '12%',
            left: '6%',
            width: '70px',
            height: '70px',
            background: 'linear-gradient(45deg, #6366F1, #8B5CF6)',
            borderRadius: '18px',
            opacity: 0.35,
            animation: 'float 6s ease-in-out infinite',
            boxShadow: '0 10px 25px rgba(99, 102, 241, 0.5)',
          }} />
          <Box sx={{
            position: 'absolute',
            top: '65%',
            right: '10%',
            width: '50px',
            height: '50px',
            background: 'linear-gradient(45deg, #A855F7, #C084FC)',
            borderRadius: '50%',
            opacity: 0.4,
            animation: 'float 8s ease-in-out infinite reverse',
            boxShadow: '0 8px 20px rgba(168, 85, 247, 0.5)',
          }} />
          <Box sx={{
            position: 'absolute',
            top: '30%',
            right: '8%',
            width: '35px',
            height: '35px',
            background: 'linear-gradient(45deg, #818CF8, #A5B4FC)',
            borderRadius: '8px',
            opacity: 0.3,
            animation: 'float 7s ease-in-out infinite',
            boxShadow: '0 6px 15px rgba(129, 140, 248, 0.4)',
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
              background: 'linear-gradient(135deg, rgba(238, 242, 255, 0.95) 0%, rgba(224, 231, 255, 0.92) 50%, rgba(219, 234, 254, 0.9) 100%)',
              backdropFilter: 'blur(30px)',
              border: '2px solid rgba(255, 255, 255, 0.4)',
              borderRadius: '20px',
              boxShadow: '0 20px 45px rgba(99, 102, 241, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.7)',
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
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.06) 0%, rgba(139, 92, 246, 0.12) 100%)',
                zIndex: 1,
              },
              '& > *': {
                position: 'relative',
                zIndex: 2,
              },
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 30px 65px rgba(99, 102, 241, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                border: '2px solid rgba(255, 255, 255, 0.6)',
              },
            }}>
              <Box sx={{
                width: '80px',
                height: '80px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #2D4A8F 0%, #4A6EC7 50%, #6366F1 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
                boxShadow: '0 15px 30px rgba(45, 74, 143, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
              }}>
                <Typography sx={{ fontSize: '2rem', color: 'white' }}>⚡</Typography>
              </Box>
              <Typography variant="h4" gutterBottom sx={{ 
                color: '#1E1B4B',
                fontWeight: 700,
                mb: 3,
                textAlign: 'center',
              }}>
                CPU Scheduler
              </Typography>
              <Typography sx={{ 
                mb: 4, 
                textAlign: 'center',
                color: '#4C1D95',
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
                  background: 'linear-gradient(135deg, #2D4A8F 0%, #4A6EC7 50%, #6366F1 100%)',
                  boxShadow: '0 12px 30px rgba(45, 74, 143, 0.4)',
                  borderRadius: '12px',
                  '&:hover': {
                    boxShadow: '0 18px 40px rgba(45, 74, 143, 0.5)',
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
              background: 'linear-gradient(135deg, rgba(238, 242, 255, 0.95) 0%, rgba(224, 231, 255, 0.92) 50%, rgba(219, 234, 254, 0.9) 100%)',
              backdropFilter: 'blur(30px)',
              border: '2px solid rgba(255, 255, 255, 0.4)',
              borderRadius: '20px',
              boxShadow: '0 20px 45px rgba(139, 92, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.7)',
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
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.06) 0%, rgba(168, 85, 247, 0.12) 100%)',
                zIndex: 1,
              },
              '& > *': {
                position: 'relative',
                zIndex: 2,
              },
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 30px 65px rgba(139, 92, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                border: '2px solid rgba(255, 255, 255, 0.6)',
              },
            }}>
              <Box sx={{
                width: '80px',
                height: '80px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #6B46C1 0%, #8B5CF6 50%, #A855F7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
                boxShadow: '0 15px 30px rgba(107, 70, 193, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
              }}>
                <Typography sx={{ fontSize: '2rem', color: 'white' }}>💿</Typography>
              </Box>
              <Typography variant="h4" gutterBottom sx={{ 
                color: '#1E1B4B',
                fontWeight: 700,
                mb: 3,
                textAlign: 'center',
              }}>
                Disk Scheduler
              </Typography>
              <Typography sx={{ 
                mb: 4, 
                textAlign: 'center',
                color: '#4C1D95',
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
                  background: 'linear-gradient(135deg, #6B46C1 0%, #8B5CF6 50%, #A855F7 100%)',
                  boxShadow: '0 12px 30px rgba(107, 70, 193, 0.4)',
                  borderRadius: '12px',
                  '&:hover': {
                    boxShadow: '0 18px 40px rgba(107, 70, 193, 0.5)',
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
            color: '#1E1B4B',
            fontWeight: 700,
            mb: 4,
          }}>
            Why Choose Our Visualizers?
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{
                p: 3,
                background: 'linear-gradient(135deg, rgba(238, 242, 255, 0.9) 0%, rgba(224, 231, 255, 0.95) 100%)',
                backdropFilter: 'blur(30px)',
                borderRadius: '16px',
                border: '2px solid rgba(255, 255, 255, 0.5)',
                height: '100%',
                boxShadow: '0 15px 35px rgba(99, 102, 241, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0 25px 50px rgba(99, 102, 241, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.7)',
                  border: '2px solid rgba(255, 255, 255, 0.7)',
                },
              }}>
                <Typography variant="h6" sx={{ color: '#1E1B4B', mb: 2, fontWeight: 600 }}>
                  🎯 Interactive Learning
                </Typography>
                <Typography sx={{ color: '#4C1D95' }}>
                  Step through algorithms with real-time visualizations and detailed explanations
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{
                p: 3,
                background: 'linear-gradient(135deg, rgba(238, 242, 255, 0.9) 0%, rgba(224, 231, 255, 0.95) 100%)',
                backdropFilter: 'blur(30px)',
                borderRadius: '16px',
                border: '2px solid rgba(255, 255, 255, 0.5)',
                height: '100%',
                boxShadow: '0 15px 35px rgba(139, 92, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0 25px 50px rgba(139, 92, 246, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.7)',
                  border: '2px solid rgba(255, 255, 255, 0.7)',
                },
              }}>
                <Typography variant="h6" sx={{ color: '#1E1B4B', mb: 2, fontWeight: 600 }}>
                  📊 Performance Metrics
                </Typography>
                <Typography sx={{ color: '#4C1D95' }}>
                  Compare algorithms with detailed performance statistics and efficiency metrics
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{
                p: 3,
                background: 'linear-gradient(135deg, rgba(238, 242, 255, 0.9) 0%, rgba(224, 231, 255, 0.95) 100%)',
                backdropFilter: 'blur(30px)',
                borderRadius: '16px',
                border: '2px solid rgba(255, 255, 255, 0.5)',
                height: '100%',
                boxShadow: '0 15px 35px rgba(168, 85, 247, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0 25px 50px rgba(168, 85, 247, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.7)',
                  border: '2px solid rgba(255, 255, 255, 0.7)',
                },
              }}>
                <Typography variant="h6" sx={{ color: '#1E1B4B', mb: 2, fontWeight: 600 }}>
                  🔧 Customizable
                </Typography>
                <Typography sx={{ color: '#4C1D95' }}>
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
        background: 'linear-gradient(135deg, rgba(240, 245, 251, 0.95) 0%, rgba(227, 234, 243, 0.92) 100%)',
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