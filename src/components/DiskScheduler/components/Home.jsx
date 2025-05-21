import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import Header from './Header';

const features = [
  {
    icon: 'I',
    title: 'Interactive Visualization',
    desc: 'Watch how processes move through the disk in real-time with animated visualizations.'
  },
  {
    icon: 'C',
    title: 'Custom Seek Positions',
    desc: 'Create your own disk request patterns or generate random ones to test algorithm performance.'
  },
  {
    icon: 'M',
    title: 'Multiple Algorithms',
    desc: 'Compare different scheduling algorithms like FCFS, SSTF, SCAN, LOOK, C-SCAN, and C-LOOK.'
  }
];

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/disk-scheduler/algorithms');
  };

  return (
    <>
      <Header />
      <div className="home-bg">
        <section className="hero-section">
          <div className="hero-card">
            <h1>Disk Scheduling Visualizer</h1>
            <p className="hero-subtitle">
              Understand how different disk scheduling algorithms work with interactive visualizations
            </p>
            <button className="get-started-btn" onClick={handleGetStarted}>
              Get Started
            </button>
          </div>
        </section>

        <section className="features-section">
          <h2 className="features-title">Key Features</h2>
          <div className="features-grid">
            {features.map((f, i) => (
              <div className="feature-card" key={i}>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
