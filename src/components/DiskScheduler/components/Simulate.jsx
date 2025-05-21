import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Simulate.css';
import Header from './Header';
import DiskSchedulingAnimation from './DiskSchedulingAnimation';

// Algorithm info for each type
const algorithmInfo = {
  fcfs: {
    title: "First Come First Serve (FCFS)",
    description: "Processes are executed in the order they arrive in the request queue. This is the simplest disk scheduling algorithm.",
    detail: "Once a request starts execution, it continues until it completes. This can lead to the 'convoy effect' where short requests wait behind long ones.",
    algorithmName: "FCFS"
  },
  sstf: {
    title: "Shortest Seek Time First (SSTF)",
    description: "Selects the request closest to the current head position, minimizing seek time.",
    detail: "SSTF can cause starvation for requests at the extreme positions if there is a continuous stream of requests near the current position.",
    algorithmName: "SSTF"
  },
  scan: {
    title: "SCAN Algorithm",
    description: "The disk arm moves in one direction until it reaches the end, then reverses direction.",
    detail: "SCAN provides better performance than FCFS and SSTF and avoids the starvation problem of SSTF.",
    algorithmName: "SCAN"
  },
  cscan: {
    title: "Circular SCAN (C-SCAN)",
    description: "Similar to SCAN, but the arm only services requests in one direction, then returns to the beginning without servicing requests.",
    detail: "C-SCAN provides more uniform wait times compared to SCAN by treating the disk as a circular list.",
    algorithmName: "C-SCAN"
  },
  look: {
    title: "LOOK Algorithm",
    description: "Similar to SCAN, but the arm only goes as far as the last request in each direction.",
    detail: "LOOK is an improvement over SCAN as it avoids going all the way to the end of the disk when there are no requests.",
    algorithmName: "LOOK"
  },
  clook: {
    title: "Circular LOOK (C-LOOK)",
    description: "Similar to C-SCAN, but the arm only goes as far as the last request in the traversal direction.",
    detail: "C-LOOK is an improvement over C-SCAN as it avoids going all the way to the end of the disk when there are no requests.",
    algorithmName: "C-LOOK"
  }
};

const Simulate = () => {
  const { algo } = useParams(); // e.g., 'fcfs', 'sstf', etc.
  const navigate = useNavigate();
  
  // Initial values for different algorithms
  let initialRequests = [20, 17, 0, 28, 15, 28, 3, 13, 7, 6];
  let initialHead = 13;
  
  // For SSTF algorithm, use the specific example from the image
  if (algo.toLowerCase() === 'sstf') {
    initialRequests = [12, 47, 7, 34, 20, 36, 37];
    initialHead = 13;
  }
  
  const trackSize = 54;
  
  // Get algorithm info or default to FCFS if not found
  const algoInfo = algorithmInfo[algo.toLowerCase()] || algorithmInfo.fcfs;
  
  // Handler for the back button
  const handleBack = () => {
    navigate('/disk-scheduler/algorithms');
  };
  
  return (
    <div className="simulate-page">
      <Header />
      <div className="main-content">
        <div className="back-button-container">
          <button className="back-button" onClick={handleBack}>
            <span>←</span> Back to Algorithms
          </button>
        </div>
        <div className="sim-page-bg">
          <div className="algorithm-info-card">
            <h2>{algoInfo.title}</h2>
            <p>{algoInfo.description}</p>
            <hr />
            <p><em>{algoInfo.detail}</em></p>
          </div>
          
          <div className="graphical-demo-container">
            <h2>Graphical Demonstration</h2>
            <DiskSchedulingAnimation 
              algorithm={algoInfo.algorithmName}
              requests={initialRequests}
              initialHead={initialHead}
              trackSize={trackSize}
              startingTrack={initialHead}
              spinDirection="right-to-left"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simulate;
