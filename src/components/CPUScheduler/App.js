import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Box, Button } from '@mui/material';
import theme from './theme';

// Import actual page components from pages folder
import AlgorithmsPageComponent from './pages/AlgorithmsPage.tsx';
import AlgorithmDetailComponent from './pages/AlgorithmDetail.tsx';
import CompareComponent from './pages/Compare.tsx';

// HomePage component (simplified from the original CPU scheduler)
const HomePage = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{
          textAlign: 'center',
          pt: { xs: 4, sm: 6 },
          pb: { xs: 6, sm: 8 },
          backgroundImage: 'linear-gradient(135deg, #E1E7FF 0%, #C1CCFF 100%)',
          borderRadius: '16px',
          position: 'relative',
          overflow: 'hidden',
          mb: { xs: 4, sm: 6 },
          boxShadow: '0 10px 40px rgba(47, 75, 191, 0.15)'
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ 
            fontWeight: 800, 
            color: '#1D3080',
            marginBottom: '1.5rem',
            fontSize: '3rem',
          }}>
            CPU Scheduling Visualizer
          </h1>
          
          <p style={{ 
            color: '#435180',
            fontWeight: 400,
            maxWidth: '700px',
            margin: '0 auto 2rem',
            fontSize: '1.5rem',
          }}>
            Understand how different CPU scheduling algorithms work with interactive visualizations
          </p>
          
          <Link 
            to="/cpu-scheduler/algorithms" 
            style={{ 
              display: 'inline-block',
              background: 'linear-gradient(90deg, #1D3080 0%, #5A7CFF 100%)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 'bold',
              boxShadow: '0 8px 20px rgba(47, 75, 191, 0.35)',
              transition: 'transform 0.2s',
              marginTop: '1rem'
            }}
          >
            Get Started
          </Link>
        </Container>
      </Box>
      
      {/* Features Section */}
      <Container maxWidth="lg">
        <h2 style={{ 
          fontWeight: 700, 
          marginBottom: '2rem',
          color: '#1F2A4B',
          fontSize: '2rem',
          textAlign: 'center'
        }}>
          Key Features
        </h2>
        
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '2rem', 
          justifyContent: 'center',
          mb: '3rem'
        }}>
          <FeatureCard 
            title="Interactive Visualization" 
            description="Watch how processes move through the CPU in real-time with animated visualizations."
            color="#5A7CFF"
          />
          <FeatureCard 
            title="Ready Queue View" 
            description="See the real-time state of the ready queue as processes are scheduled."
            color="#42DDFF"
          />
          <FeatureCard 
            title="Multiple Algorithms" 
            description="Compare different scheduling algorithms like FCFS, SJF, Priority, and Round Robin."
            color="#9FAEF0"
          />
        </Box>
      </Container>
    </Box>
  );
};

// Feature Card Component
const FeatureCard = ({ title, description, color }) => {
  return (
    <div
      style={{
        padding: '1.5rem',
        borderRadius: '12px',
        backgroundColor: 'white',
        width: '280px',
        boxShadow: '0 6px 20px rgba(47, 75, 191, 0.08)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        border: '1px solid rgba(159, 174, 240, 0.3)',
      }}
    >
      <div 
        style={{ 
          width: '48px',
          height: '48px',
          borderRadius: '10px',
          backgroundColor: color,
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '1.4rem',
          boxShadow: `0 6px 15px ${color}40`
        }}
      >
        {title.charAt(0)}
      </div>
      <h3 style={{ fontWeight: 600, color: '#1F2A4B', marginBottom: '0.75rem' }}>
        {title}
      </h3>
      <p style={{ color: '#435180' }}>
        {description}
      </p>
    </div>
  );
};

// CPU submenu navigation instead of a full header
const CPUSubMenu = () => {
  return (
    <Box sx={{ 
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      p: 2.5,
      mb: 4,
      background: 'linear-gradient(90deg, rgba(47, 75, 191, 0.15) 0%, rgba(0, 105, 192, 0.25) 100%)',
      borderRadius: '12px',
      boxShadow: '0 4px 15px rgba(47, 75, 191, 0.08)',
      borderBottom: '1px solid rgba(47, 75, 191, 0.1)'
    }}>
      <Box>
        <Link to="/" style={{ 
          color: '#1D3080', 
          textDecoration: 'none',
          fontWeight: 700,
          fontSize: '1.4rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            background: 'rgba(47, 75, 191, 0.1)',
            fontSize: '16px'
          }}>🖥️</span>
          Scheduler App
        </Link>
      </Box>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button 
          component={Link} 
          to="/cpu-scheduler" 
          sx={{ 
            color: '#1D3080',
            fontWeight: 600,
            fontSize: '1rem',
            transition: 'all 0.2s',
            '&:hover': {
              background: 'rgba(47, 75, 191, 0.08)',
              transform: 'translateY(-2px)'
            }
          }}
        >
          Home
        </Button>
        <Button 
          component={Link} 
          to="/cpu-scheduler/algorithms" 
          sx={{ 
            color: '#1D3080',
            fontWeight: 600,
            fontSize: '1rem',
            transition: 'all 0.2s',
            '&:hover': {
              background: 'rgba(47, 75, 191, 0.08)',
              transform: 'translateY(-2px)'
            }
          }}
        >
          Algorithms
        </Button>
        <Button 
          component={Link} 
          to="/cpu-scheduler/compare" 
          sx={{ 
            color: '#1D3080',
            fontWeight: 600,
            fontSize: '1rem',
            transition: 'all 0.2s',
            '&:hover': {
              background: 'rgba(47, 75, 191, 0.08)',
              transform: 'translateY(-2px)'
            }
          }}
        >
          Compare
        </Button>
      </Box>
    </Box>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default
      }}>
        <CPUSubMenu />
        <Container 
          maxWidth="lg" 
          sx={{ 
            mb: 4, 
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/algorithms" element={<AlgorithmsPageComponent />} />
            <Route path="/algorithm/:algorithmId" element={<AlgorithmDetailComponent />} />
            <Route path="/compare" element={<CompareComponent />} />
            
            {/* Add routes with full paths for the nested routing */}
            <Route path="/cpu-scheduler" element={<HomePage />} />
            <Route path="/cpu-scheduler/algorithms" element={<AlgorithmsPageComponent />} />
            <Route path="/cpu-scheduler/algorithm/:algorithmId" element={<AlgorithmDetailComponent />} />
            <Route path="/cpu-scheduler/compare" element={<CompareComponent />} />
          </Routes>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App; 