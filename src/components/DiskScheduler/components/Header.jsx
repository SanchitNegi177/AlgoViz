import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();

  const handleAlgorithmsClick = () => {
    navigate('/disk-scheduler/algorithms');
  };

  return (
    <div className="scheduler-submenu">
      <div className="submenu-left">
        <Link to="/" className="app-title-link">
          <span className="app-icon">🖥️</span>
          Scheduler App
        </Link>
      </div>
      <div className="submenu-right">
        <Link to="/disk-scheduler" className="header-link">Home</Link>
        <Link to="/disk-scheduler/disk-visualization" className="header-link">Visualizer</Link>
        <button onClick={handleAlgorithmsClick} className="header-link">Algorithms</button>
      </div>
    </div>
  );
};

export default Header;
