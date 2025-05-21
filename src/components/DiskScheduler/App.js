import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Simulate from './components/Simulate';
import DiskAlgorithms from './components/DiskAlgorithms';
import DiskSchedulingAnimation from './components/DiskSchedulingAnimation';
import './app-styles.css';

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