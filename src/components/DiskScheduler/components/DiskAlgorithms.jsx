import React from 'react';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import './AlgorithmList.css';

const algorithms = [
  {
    title: "FCFS",
    description: "Processes are executed in the order they arrive in the ready queue. Simple but may not be optimal for different process priorities.",
    strengths: [
      "Simple to implement",
      "Fair for processes that arrive first",
      "Low scheduling overhead"
    ],
    weaknesses: [
      "Can lead to convoy effect",
      "Long average waiting time",
      "Not suitable for interactive systems"
    ],
    path: "fcfs"
  },
  {
    title: "SSTF",
    description: "Shortest seek time first. Selects the request closest to the current head position.",
    strengths: [
      "Reduces total head movement",
      "Better performance than FCFS",
      "Good for moderate workloads"
    ],
    weaknesses: [
      "May cause starvation of some requests",
      "Not optimal for all workloads"
    ],
    path: "sstf"
  },
  {
    title: "SCAN",
    description: "Disk arm moves in one direction, servicing requests until it reaches the end, then reverses direction.",
    strengths: [
      "Prevents starvation",
      "Uniform wait time",
      "Efficient for heavy loads"
    ],
    weaknesses: [
      "Longer wait for requests just missed by the head",
      "Not optimal for light loads"
    ],
    path: "scan"
  },
  {
    title: "LOOK",
    description: "Goes only to last request in each direction, then reverses. More efficient than SCAN.",
    strengths: [
      "Reduces unnecessary head movement",
      "Prevents starvation",
      "Efficient for heavy loads"
    ],
    weaknesses: [
      "Still not optimal for all workloads",
      "Longer wait for requests just missed by the head"
    ],
    path: "look"
  },
  {
    title: "C-SCAN",
    description: "Circular scan from start to end. Services requests in one direction only, then jumps to the beginning.",
    strengths: [
      "Provides more uniform wait time",
      "Prevents starvation",
      "Efficient for heavy loads"
    ],
    weaknesses: [
      "Longer average seek time than LOOK",
      "Unnecessary jump to start increases movement"
    ],
    path: "cscan"
  },
  {
    title: "C-LOOK",
    description: "Circular LOOK algorithm. Goes only as far as the last request in one direction, then jumps to the first request in the other direction.",
    strengths: [
      "Reduces unnecessary head movement",
      "Uniform wait time",
      "Efficient for heavy loads"
    ],
    weaknesses: [
      "Unnecessary jump to start increases movement",
      "Not optimal for all workloads"
    ],
    path: "clook"
  }
];

const DiskAlgorithms = () => {
  const navigate = useNavigate();
  return (
    <>
      <Header />
      <div className="home-bg">
        <div className="algorithm-section">
          <h2 className="algorithms-title">Disk Scheduling Algorithms</h2>
          <div className="algorithm-grid">
            {algorithms.map((algo, index) => (
              <div
                className="algorithm-card clickable-algo-card"
                key={index}
                onClick={() => navigate(`/disk-scheduler/simulate/${algo.path}`)}
                tabIndex={0}
                role="button"
                onKeyPress={e => { if (e.key === 'Enter') navigate(`/disk-scheduler/simulate/${algo.path}`); }}
              >
                <h3 className="algo-title">{algo.title}</h3>
                <p className="algo-desc">{algo.description}</p>
                <hr />
                <div className="algo-strengths">
                  <span className="strength-title">Strengths:</span>
                  <ul>
                    {algo.strengths.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
                <div className="algo-weaknesses">
                  <span className="weakness-title">Weaknesses:</span>
                  <ul>
                    {algo.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default DiskAlgorithms; 