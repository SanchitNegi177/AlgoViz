import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Simulate from './components/Simulate';
import DiskAlgorithms from './components/DiskAlgorithms';
import DiskSchedulingAnimation from './components/DiskSchedulingAnimation';
import './app-styles.css';

// Original Disk Scheduler Components
// We'll recreate simplified versions of the original app's components
// In a real implementation, you would import the actual components from the Disk scheduler

// Home Component
const HomeComponent = () => {
  return (
    <div className="home-container" style={{ padding: '2rem' }}>
      <div className="home-bg" style={{ 
        background: 'linear-gradient(135deg, #D8F2FF 0%, #A9E0FF 100%)',
        borderRadius: '16px',
        padding: '3rem 2rem',
        textAlign: 'center',
        boxShadow: '0 10px 30px rgba(0, 105, 192, 0.15)'
      }}>
        <div className="hero-section">
          <div className="hero-card">
            <h1 style={{ 
              color: '#004C8C', 
              marginBottom: '1.5rem',
              fontSize: '2.5rem',
              fontWeight: 'bold'
            }}>Disk Scheduling Visualizer</h1>
            <p className="hero-subtitle" style={{ 
              color: '#006DB3',
              marginBottom: '2rem',
              fontSize: '1.2rem',
              maxWidth: '700px',
              margin: '0 auto 2rem'
            }}>
              Understand how different disk scheduling algorithms work with interactive visualizations
            </p>
            
            <Link to="/disk-scheduler/algorithms" style={{
              backgroundColor: '#0069C0',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              textDecoration: 'none',
              fontWeight: 'bold',
              display: 'inline-block',
              boxShadow: '0 6px 15px rgba(0, 105, 192, 0.3)'
            }}>
              View Algorithms
            </Link>
          </div>
        </div>
        
        <div style={{ 
          marginTop: '4rem',
          padding: '2rem',
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <p style={{ color: '#004C8C' }}>
            Disk Scheduling Animation Placeholder
          </p>
          <p style={{ color: '#006DB3', marginTop: '1rem' }}>
            In the actual implementation, this would display a disk scheduling animation
          </p>
        </div>
      </div>
    </div>
  );
};

// Algorithms Page
const DiskAlgorithmsComponent = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ color: '#004C8C', marginBottom: '2rem', textAlign: 'center' }}>Disk Scheduling Algorithms</h1>
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: '1.5rem',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {[          { id: 'fcfs', name: 'First Come First Served (FCFS)', description: 'Serves requests in the order they arrive' },          { id: 'sstf', name: 'Shortest Seek Time First (SSTF)', description: 'Selects the request with minimum seek time from current position' },          { id: 'scan', name: 'SCAN (Elevator)', description: 'Services requests in one direction until the end, then reverses' },          { id: 'cscan', name: 'C-SCAN (Circular SCAN)', description: 'Services requests in one direction, then jumps to the beginning' },          { id: 'look', name: 'LOOK', description: 'Like SCAN but only goes as far as the last request' },          { id: 'clook', name: 'C-LOOK', description: 'Like C-SCAN but only goes as far as the last request' }        ].map(algo => (          <div             key={algo.id}            style={{              padding: '1.5rem',              borderRadius: '8px',              backgroundColor: 'white',              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',              cursor: 'pointer',              transition: 'transform 0.2s ease',            }}          >            <h3 style={{ color: '#004C8C', marginBottom: '0.5rem' }}>{algo.name}</h3>            <p style={{ color: '#006DB3', marginBottom: '1rem' }}>{algo.description}</p>            <button               style={{                 padding: '0.5rem 1rem',                backgroundColor: '#0069C0',                color: 'white',                border: 'none',                borderRadius: '4px',                cursor: 'pointer',              }}            >              Visualize {algo.name.split(' ')[0]}            </button>          </div>        ))}
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button 
          style={{ 
            padding: '0.5rem 1rem',
            backgroundColor: '#f5f5f5',
            color: '#333',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Back to Disk Home
        </button>
      </div>
    </div>
  );
};

// Simulation Page
const SimulateComponent = () => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ color: '#004C8C', marginBottom: '2rem' }}>Disk Scheduling Simulation</h1>
      <p style={{ color: '#006DB3', marginBottom: '2rem' }}>
        This is a placeholder for the disk scheduling simulation component.
        In a real implementation, this would contain the actual simulation logic.
      </p>
      
      <div style={{ 
        padding: '2rem',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        maxWidth: '800px',
        margin: '0 auto 2rem',
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px dashed #ccc'
      }}>
        <p>Disk Scheduling Visualization would appear here</p>
      </div>
      
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button 
          style={{ 
            padding: '0.5rem 1rem',
            backgroundColor: '#f5f5f5',
            color: '#333',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Back to Algorithms
        </button>
        
        <button 
          style={{ 
            padding: '0.5rem 1rem',
            backgroundColor: '#f5f5f5',
            color: '#333',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Back to Disk Home
        </button>
      </div>
    </div>
  );
};

// Main Disk App component with internal routing
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/simulate/:algo" element={<Simulate />} />
      <Route path="/algorithms" element={<DiskAlgorithms />} />
      <Route path="/disk-visualization" element={
        <div>
          <Header />
          <div className="home-bg" style={{ padding: '20px' }}>
            <div className="hero-section">
              <div className="hero-card">
                <h1>Disk Scheduling Visualizer</h1>
                <p className="hero-subtitle">
                  Understand how different disk scheduling algorithms work with interactive visualizations
                </p>
              </div>
            </div>
            <DiskSchedulingAnimation 
              algorithm="FCFS"
              requests={[10, 22, 20, 2, 40, 6, 38]}
              initialHead={13}
              trackSize={54}
              startingTrack={13}
              spinDirection="right-to-left"
            />
            <div className="back-to-algorithms-container">
              <Link to="/disk-scheduler/algorithms" className="back-to-algorithms-btn">
                Back to Algorithms
              </Link>
            </div>
          </div>
        </div>
      } />
    </Routes>
  );
}

export default App; 