import React, { useState, useRef, useEffect } from 'react';
import './DiskSchedulingAnimation.css';

// Disk scheduling algorithm implementations
const calculateSeekSequence = (algorithm, requests, startingTrack, trackSize, direction) => {
  if (!requests || requests.length === 0) return [];
  
  // Make a copy to avoid modifying the original array
  const requestsCopy = [...requests];
  
  switch(algorithm) {
    case 'FCFS':
      // First-Come-First-Serve: Simply return the requests in their original order
      return requestsCopy;
      
    case 'SSTF':
      // Shortest-Seek-Time-First: Always choose the closest request
      const sstfResult = [];
      let currentPosition = startingTrack;
      
      // Copy of requests that we'll remove from as we process them
      const remainingRequests = [...requestsCopy];
      
      while (remainingRequests.length > 0) {
        // Find the closest request to current position
        let closestIndex = 0;
        let minDistance = Math.abs(remainingRequests[0] - currentPosition);
        
        for (let i = 1; i < remainingRequests.length; i++) {
          const distance = Math.abs(remainingRequests[i] - currentPosition);
          if (distance < minDistance) {
            minDistance = distance;
            closestIndex = i;
          }
        }
        
        // Add the closest request to result and update current position
        const nextRequest = remainingRequests[closestIndex];
        sstfResult.push(nextRequest);
        currentPosition = nextRequest;
        
        // Remove this request from the remaining list
        remainingRequests.splice(closestIndex, 1);
      }
      
      return sstfResult;
      
    case 'SCAN':
      // SCAN (Elevator): Go in one direction until the end, then reverse
      const scanResult = [];
      let scanCurrentPosition = startingTrack;
      
      // Sort requests for easier processing
      const sortedRequests = [...requestsCopy].sort((a, b) => a - b);
      
      // Determine initial direction
      let scanDirection = direction === 'left-to-right' ? 1 : -1;
      
      // Find requests in the current direction
      const higher = sortedRequests.filter(req => req >= scanCurrentPosition);
      const lower = sortedRequests.filter(req => req < scanCurrentPosition);
      
      if (scanDirection === 1) {
        // Going right first (ascending), then left (descending)
        scanResult.push(...higher);
        // Add the highest track (end of disk)
        if (higher.length > 0 && higher[higher.length - 1] < trackSize - 1) {
          scanResult.push(trackSize - 1);
        }
        // Then reverse direction and go left
        scanResult.push(...lower.sort((a, b) => b - a));
      } else {
        // Going left first (descending), then right (ascending)
        scanResult.push(...lower.sort((a, b) => b - a));
        // Add the lowest track (start of disk)
        if (lower.length > 0 && lower[lower.length - 1] > 0) {
          scanResult.push(0);
        }
        // Then reverse direction and go right
        scanResult.push(...higher);
      }
      
      return scanResult;
      
    case 'C-SCAN':
      // C-SCAN: Go in one direction until the end, then jump to the beginning and continue
      const cscanResult = [];
      
      // Sort requests for easier processing
      const cscanSortedRequests = [...requestsCopy].sort((a, b) => a - b);
      
      // Find requests after current position
      const requestsAfter = cscanSortedRequests.filter(req => req >= startingTrack);
      const requestsBefore = cscanSortedRequests.filter(req => req < startingTrack);
      
      if (direction === 'left-to-right') {
        // Going right, then jump to leftmost and continue right
        cscanResult.push(...requestsAfter);
        // Add the highest track (end of disk)
        if (requestsAfter.length > 0 && requestsAfter[requestsAfter.length - 1] < trackSize - 1) {
          cscanResult.push(trackSize - 1);
        }
        // Jump to beginning
        if (requestsBefore.length > 0) {
          cscanResult.push(0);
        }
        // Continue with requests before the starting position
        cscanResult.push(...requestsBefore);
      } else {
        // Going left, then jump to rightmost and continue left
        cscanResult.push(...requestsBefore.sort((a, b) => b - a));
        // Add the lowest track (start of disk)
        if (requestsBefore.length > 0 && requestsBefore[0] > 0) {
          cscanResult.push(0);
        }
        // Jump to end
        if (requestsAfter.length > 0) {
          cscanResult.push(trackSize - 1);
        }
        // Continue with requests after the starting position
        cscanResult.push(...requestsAfter.sort((a, b) => b - a));
      }
      
      return cscanResult;
      
    case 'LOOK':
      // LOOK: Like SCAN but only go as far as the last request
      const lookResult = [];
      
      // Sort requests for easier processing
      const lookSortedRequests = [...requestsCopy].sort((a, b) => a - b);
      
      // Find requests after and before current position
      const requestsHigher = lookSortedRequests.filter(req => req >= startingTrack);
      const requestsLower = lookSortedRequests.filter(req => req < startingTrack);
      
      if (direction === 'left-to-right') {
        // Going right first, then left
        lookResult.push(...requestsHigher);
        // Then reverse direction and go left
        lookResult.push(...requestsLower.sort((a, b) => b - a));
      } else {
        // Going left first, then right
        lookResult.push(...requestsLower.sort((a, b) => b - a));
        // Then reverse direction and go right
        lookResult.push(...requestsHigher);
      }
      
      return lookResult;
      
    case 'C-LOOK':
      // C-LOOK: Like C-SCAN but only go as far as the last request
      const clookResult = [];
      
      // Sort requests for easier processing
      const clookSortedRequests = [...requestsCopy].sort((a, b) => a - b);
      
      // Find requests after and before current position
      const after = clookSortedRequests.filter(req => req >= startingTrack);
      const before = clookSortedRequests.filter(req => req < startingTrack);
      
      if (direction === 'left-to-right') {
        // Going right, then jump to leftmost request and continue right
        clookResult.push(...after);
        // Then jump to leftmost request and continue
        clookResult.push(...before);
      } else {
        // Going left, then jump to rightmost request and continue left
        clookResult.push(...before.sort((a, b) => b - a));
        // Then jump to rightmost request and continue
        clookResult.push(...after.sort((a, b) => b - a));
      }
      
      return clookResult;
      
    default:
      return requestsCopy;
  }
};

const DiskSchedulingAnimation = ({ 
  algorithm = 'FCFS',
  requests = [],
  initialHead = 0,
  trackSize = 30,
  startingTrack = 13,
  spinDirection = 'left-to-right',
  onAnimationComplete = () => {}
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [steps, setSteps] = useState(0);
  const [totalSteps, setTotalSteps] = useState(requests.length);
  const [trackSizeValue, setTrackSizeValue] = useState(trackSize);
  const [startingTrackValue, setStartingTrackValue] = useState(startingTrack);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(algorithm);
  const [directionValue, setDirectionValue] = useState(spinDirection);
  const [customInput, setCustomInput] = useState('');
  const [currentRequests, setCurrentRequests] = useState(requests);
  const canvasRef = useRef(null);
  
  // State for input fields
  const [trackSizeInput, setTrackSizeInput] = useState(trackSize.toString());
  const [startingTrackInput, setStartingTrackInput] = useState(startingTrack.toString());

  // Initialize the component with proper values
  useEffect(() => {
    // Calculate the sequence for the selected algorithm
    const algorithmSequence = calculateSeekSequence(
      algorithm,
      requests,
      startingTrack,
      trackSize,
      spinDirection
    );
    
    setTotalSteps(algorithmSequence.length);
    setTrackSizeValue(trackSize);
    setTrackSizeInput(trackSize.toString());
    setStartingTrackValue(startingTrack);
    setStartingTrackInput(startingTrack.toString());
    setSelectedAlgorithm(algorithm);
    setDirectionValue(spinDirection);
    setCurrentRequests(requests);
    setCustomInput('');
    
    // Draw the initial graph
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      // Clear and redraw logic here
      // This is just a placeholder - the actual drawing happens in the useEffect below
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [requests, trackSize, startingTrack, algorithm, spinDirection]);

  // Use separate useEffect for drawing that depends on state changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;

    // Clear canvas
    ctx.clearRect(0, 0, width, 400);

    // Set up coordinate system and background
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, width, 400);
    
    // Draw title
    ctx.fillStyle = "#666";
    ctx.font = "12px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Time", 10, 15);
    
    // Calculate the sequence based on the selected algorithm
    const algorithmSequence = calculateSeekSequence(
      selectedAlgorithm, 
      currentRequests, 
      startingTrackValue, 
      trackSizeValue, 
      directionValue
    );
    
    // Calculate current steps to display based on animation progress
    const validRequests = algorithmSequence.slice(0, currentStep + 1);
    
    // Draw algorithm name and status
    if (validRequests.length > 0) {
      ctx.fillStyle = "#f00";
      ctx.fillText(`${selectedAlgorithm} (${currentRequests.length})`, 70, 15);
    } else {
      ctx.fillStyle = "#666";
      ctx.fillText(`${selectedAlgorithm} (No entries)`, 70, 15);
    }
    
    // Set up disk position scale
    const margin = { top: 30, right: 30, bottom: 20, left: 50 };
    const graphWidth = width - margin.left - margin.right;
    
    // Calculate scale based on track size
    const maxTrack = trackSizeValue || 30;
    
    // Draw the timeline/track position scale
    ctx.beginPath();
    ctx.strokeStyle = "#666";
    ctx.lineWidth = 1;
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(width - margin.right, margin.top);
    ctx.stroke();
    
    // Draw track numbers (every 5 positions)
    const numTicks = Math.min(12, maxTrack); // Limit to reasonable number of ticks
    const tickInterval = Math.ceil(maxTrack / numTicks);
    
    for (let i = 0; i <= maxTrack; i += tickInterval) {
      const x = margin.left + (i / maxTrack) * graphWidth;
      
      // Draw tick
      ctx.beginPath();
      ctx.moveTo(x, margin.top - 5);
      ctx.lineTo(x, margin.top + 5);
      ctx.stroke();
      
      // Draw label
      ctx.fillStyle = "#666";
      ctx.font = "11px Arial";
      ctx.textAlign = "center";
      ctx.fillText(i.toString(), x, margin.top - 8);
    }
    
    // Draw track ruler marks
    ctx.beginPath();
    ctx.strokeStyle = "#ddd";
    
    for (let i = 0; i <= maxTrack; i += tickInterval / 2) {
      const x = margin.left + (i / maxTrack) * graphWidth;
      ctx.moveTo(x, margin.top);
      ctx.lineTo(x, 400 - margin.bottom);
    }
    ctx.stroke();

    // If no seek positions are set, draw a hint message
    if (currentRequests.length === 0) {
      ctx.fillStyle = "#999";
      ctx.font = "14px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Enter seek positions and click 'Apply' or use 'Random' to generate positions", width / 2, 200);
      
      // Draw a marker for the starting track position
      const startX = margin.left + (startingTrackValue / maxTrack) * graphWidth;
      const startY = margin.top + 60;
      
      ctx.beginPath();
      ctx.fillStyle = "#3b5bdb";
      ctx.arc(startX, startY, 5, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = "#3b5bdb";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Starting position", startX, startY - 10);
      return;
    }
    
    // Draw movement path with enhanced visibility
    if (currentRequests.length > 0 && currentStep > 0) {
      const points = [];
      
      // Add the starting track position as the first point
      const startX = margin.left + (startingTrackValue / maxTrack) * graphWidth;
      const startY = margin.top + 20;
      points.push({ x: startX, y: startY, value: startingTrackValue });
      
      // Collect the points for the path
      for (let i = 0; i < validRequests.length; i++) {
        const y = margin.top + 20 + (i + 1) * 20; // Vertical spacing between points
        const x = margin.left + (validRequests[i] / maxTrack) * graphWidth;
        points.push({ x, y, value: validRequests[i] });
      }
      
      // Draw connecting lines
      ctx.beginPath();
      ctx.strokeStyle = "red";
      ctx.lineWidth = 1.5;
      
      for (let i = 0; i < points.length; i++) {
        if (i === 0) {
          ctx.moveTo(points[i].x, points[i].y);
        } else {
          ctx.lineTo(points[i].x, points[i].y);
        }
      }
      ctx.stroke();
      
      // Draw the dots
      for (let i = 0; i < points.length; i++) {
        // Draw dot
        ctx.beginPath();
        ctx.fillStyle = i === 0 ? "#3b5bdb" : (i === points.length - 1 ? "red" : "#999");
        ctx.arc(points[i].x, points[i].y, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw label for starting point
        if (i === 0) {
          ctx.fillStyle = "#3b5bdb";
          ctx.font = "10px Arial";
          ctx.textAlign = "center";
          ctx.fillText("Start", points[i].x, points[i].y - 8);
        } else {
          // Draw track numbers next to each point
          ctx.fillStyle = "#666";
          ctx.font = "10px Arial";
          ctx.textAlign = "left";
          ctx.fillText(points[i].value, points[i].x + 8, points[i].y + 4);
        }
        
        // Draw small circle around the current position
        if (i === points.length - 1) {
          ctx.beginPath();
          ctx.strokeStyle = "red";
          ctx.arc(points[i].x, points[i].y, 5, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    } else if (currentRequests.length > 0) {
      // Draw just the starting position when no steps have been taken
      const startX = margin.left + (startingTrackValue / maxTrack) * graphWidth;
      const startY = margin.top + 20;
      
      ctx.beginPath();
      ctx.fillStyle = "#3b5bdb";
      ctx.arc(startX, startY, 3, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = "#3b5bdb";
      ctx.font = "10px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Start", startX, startY - 8);
    }
  }, [currentStep, trackSizeValue, startingTrackValue, currentRequests, selectedAlgorithm, directionValue]);

  const startAnimation = () => {
    setIsPlaying(true);
    setIsPaused(false);
  };

  const togglePauseResume = () => {
    if (isPlaying) {
      // Currently playing, so pause it
      setIsPlaying(false);
      setIsPaused(true);
    } else if (isPaused) {
      // Currently paused, so resume it
      setIsPlaying(true);
      setIsPaused(false);
    }
  };

  const resetAnimation = () => {
    setCurrentStep(0);
    setSteps(0);
    setIsPlaying(false);
    setIsPaused(false);
    drawDiskSchedulingGraph();
  };

  const handleSliderChange = (e) => {
    const value = parseInt(e.target.value);
    setSteps(value);
    setCurrentStep(value);
    drawDiskSchedulingGraph();
  };

  const handleCustomInputChange = (e) => {
    setCustomInput(e.target.value);
  };

  const applyCustomInput = () => {
    try {
      // Check if input is empty
      if (!customInput || customInput.trim() === '') {
        alert('Please enter seek positions or use the "Random" button to generate them');
        return;
      }

      // Parse comma-separated values to numbers
      const inputValues = customInput.split(',')
        .map(val => val.trim())
        .filter(val => val !== '')
        .map(val => parseInt(val));
      
      // Validate all inputs are valid numbers
      if (inputValues.some(isNaN)) {
        alert('Please enter valid numbers separated by commas');
        return;
      }
      
      // Validate all numbers are within track size range
      if (inputValues.some(val => val < 0 || val >= trackSizeValue)) {
        alert(`All values must be between 0 and ${trackSizeValue - 1}`);
        return;
      }
      
      setCurrentRequests(inputValues);
      
      // Calculate the sequence for the selected algorithm
      const algorithmSequence = calculateSeekSequence(
        selectedAlgorithm,
        inputValues,
        startingTrackValue,
        trackSizeValue,
        directionValue
      );
      
      // Update total steps based on the algorithm sequence
      setTotalSteps(algorithmSequence.length);
      
      // Reset animation state
      setCurrentStep(0);
      setSteps(0);
      setIsPlaying(false);
      setIsPaused(false);
      drawDiskSchedulingGraph();
    } catch (error) {
      alert('Error parsing input. Please enter numbers separated by commas.');
    }
  };

  const generateRandomInput = (size = trackSizeValue) => {
    // Generate between 5-10 random positions
    const count = Math.floor(Math.random() * 6) + 5;
    const randomPositions = Array.from({ length: count }, () => 
      Math.floor(Math.random() * size)
    );
    
    // Only fill the input field with random values
    setCustomInput(randomPositions.join(', '));
    
    // Note: Algorithm execution should only happen when Apply button is clicked
    // Do not update currentRequests, calculate sequences, or redraw graph here
  };

  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < totalSteps) {
      timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setSteps(prev => prev + 1);
      }, 1000);
    } else if (currentStep >= totalSteps) {
      setIsPlaying(false);
      onAnimationComplete();
    }
    
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, totalSteps, onAnimationComplete]);

  const drawDiskSchedulingGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;

    // Clear canvas
    ctx.clearRect(0, 0, width, 400);

    // Set up coordinate system and background
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, width, 400);
    
    // Draw title
    ctx.fillStyle = "#666";
    ctx.font = "12px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Time", 10, 15);
    
    // Calculate the sequence based on the selected algorithm
    const algorithmSequence = calculateSeekSequence(
      selectedAlgorithm, 
      currentRequests, 
      startingTrackValue, 
      trackSizeValue, 
      directionValue
    );
    
    // Calculate current steps to display based on animation progress
    const validRequests = algorithmSequence.slice(0, currentStep + 1);
    
    // Draw algorithm name and status
    if (validRequests.length > 0) {
      ctx.fillStyle = "#f00";
      ctx.fillText(`${selectedAlgorithm} (${currentRequests.length})`, 70, 15);
    } else {
      ctx.fillStyle = "#666";
      ctx.fillText(`${selectedAlgorithm} (No entries)`, 70, 15);
    }
    
    // Set up disk position scale
    const margin = { top: 30, right: 30, bottom: 20, left: 50 };
    const graphWidth = width - margin.left - margin.right;
    
    // Calculate scale based on track size
    const maxTrack = trackSizeValue || 30;
    
    // Draw the timeline/track position scale
    ctx.beginPath();
    ctx.strokeStyle = "#666";
    ctx.lineWidth = 1;
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(width - margin.right, margin.top);
    ctx.stroke();
    
    // Draw track numbers (every 5 positions)
    const numTicks = Math.min(12, maxTrack); // Limit to reasonable number of ticks
    const tickInterval = Math.ceil(maxTrack / numTicks);
    
    for (let i = 0; i <= maxTrack; i += tickInterval) {
      const x = margin.left + (i / maxTrack) * graphWidth;
      
      // Draw tick
      ctx.beginPath();
      ctx.moveTo(x, margin.top - 5);
      ctx.lineTo(x, margin.top + 5);
      ctx.stroke();
      
      // Draw label
      ctx.fillStyle = "#666";
      ctx.font = "11px Arial";
      ctx.textAlign = "center";
      ctx.fillText(i.toString(), x, margin.top - 8);
    }
    
    // Draw track ruler marks
    ctx.beginPath();
    ctx.strokeStyle = "#ddd";
    
    for (let i = 0; i <= maxTrack; i += tickInterval / 2) {
      const x = margin.left + (i / maxTrack) * graphWidth;
      ctx.moveTo(x, margin.top);
      ctx.lineTo(x, 400 - margin.bottom);
    }
    ctx.stroke();

    // If no seek positions are set, draw a hint message
    if (currentRequests.length === 0) {
      ctx.fillStyle = "#999";
      ctx.font = "14px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Enter seek positions and click 'Apply' or use 'Random' to generate positions", width / 2, 200);
      
      // Draw a marker for the starting track position
      const startX = margin.left + (startingTrackValue / maxTrack) * graphWidth;
      const startY = margin.top + 60;
      
      ctx.beginPath();
      ctx.fillStyle = "#3b5bdb";
      ctx.arc(startX, startY, 5, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = "#3b5bdb";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Starting position", startX, startY - 10);
      return;
    }
    
    // Draw movement path with enhanced visibility
    if (currentRequests.length > 0 && currentStep > 0) {
      const points = [];
      
      // Add the starting track position as the first point
      const startX = margin.left + (startingTrackValue / maxTrack) * graphWidth;
      const startY = margin.top + 20;
      points.push({ x: startX, y: startY, value: startingTrackValue });
      
      // Collect the points for the path
      for (let i = 0; i < validRequests.length; i++) {
        const y = margin.top + 20 + (i + 1) * 20; // Vertical spacing between points
        const x = margin.left + (validRequests[i] / maxTrack) * graphWidth;
        points.push({ x, y, value: validRequests[i] });
      }
      
      // Draw connecting lines
      ctx.beginPath();
      ctx.strokeStyle = "red";
      ctx.lineWidth = 1.5;
      
      for (let i = 0; i < points.length; i++) {
        if (i === 0) {
          ctx.moveTo(points[i].x, points[i].y);
        } else {
          ctx.lineTo(points[i].x, points[i].y);
        }
      }
      ctx.stroke();
      
      // Draw the dots
      for (let i = 0; i < points.length; i++) {
        // Draw dot
        ctx.beginPath();
        ctx.fillStyle = i === 0 ? "#3b5bdb" : (i === points.length - 1 ? "red" : "#999");
        ctx.arc(points[i].x, points[i].y, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw label for starting point
        if (i === 0) {
          ctx.fillStyle = "#3b5bdb";
          ctx.font = "10px Arial";
          ctx.textAlign = "center";
          ctx.fillText("Start", points[i].x, points[i].y - 8);
        } else {
          // Draw track numbers next to each point
          ctx.fillStyle = "#666";
          ctx.font = "10px Arial";
          ctx.textAlign = "left";
          ctx.fillText(points[i].value, points[i].x + 8, points[i].y + 4);
        }
        
        // Draw small circle around the current position
        if (i === points.length - 1) {
          ctx.beginPath();
          ctx.strokeStyle = "red";
          ctx.arc(points[i].x, points[i].y, 5, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    } else if (currentRequests.length > 0) {
      // Draw just the starting position when no steps have been taken
      const startX = margin.left + (startingTrackValue / maxTrack) * graphWidth;
      const startY = margin.top + 20;
      
      ctx.beginPath();
      ctx.fillStyle = "#3b5bdb";
      ctx.arc(startX, startY, 3, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = "#3b5bdb";
      ctx.font = "10px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Start", startX, startY - 8);
    }
  };

  // Apply track size change with validation
  const handleTrackSizeChange = (e) => {
    const inputValue = e.target.value;
    
    // Update the input field state to show exactly what user types
    setTrackSizeInput(inputValue);
    
    // If empty or not a number, don't update the actual track size yet
    if (inputValue === '' || isNaN(parseInt(inputValue, 10))) {
      return;
    }
    
    // Parse as decimal
    const value = parseInt(inputValue, 10);
    
    // Only update if it's a valid number
    if (!isNaN(value) && value >= 10) {
      const newTrackSize = value;
      
      // Check if any requests exceed the new track size
      const needNewRequests = currentRequests.some(req => req >= newTrackSize);
      
      // Update track size
      setTrackSizeValue(newTrackSize);
      
      // Update startingTrackValue if needed
      if (startingTrackValue >= newTrackSize) {
        setStartingTrackValue(newTrackSize - 1);
        setStartingTrackInput((newTrackSize - 1).toString());
      }
      
      // Clear invalid requests when track size changes
      if (needNewRequests) {
        setCurrentRequests([]);
        setCustomInput('');
        setTotalSteps(0);
        setCurrentStep(0);
        setSteps(0);
        setIsPlaying(false);
        setIsPaused(false);
      }
      drawDiskSchedulingGraph();
    }
  };

  // Handle starting track input change
  const handleStartingTrackChange = (e) => {
    const inputValue = e.target.value;
    
    // Update the input field state to show exactly what user types
    setStartingTrackInput(inputValue);
    
    // If empty or not a number, don't update the actual starting track yet
    if (inputValue === '' || isNaN(parseInt(inputValue, 10))) {
      return;
    }
    
    // Parse as decimal
    const value = parseInt(inputValue, 10);
    
    // Only update if it's a valid number within range
    if (!isNaN(value) && value >= 0 && value < trackSizeValue) {
      setStartingTrackValue(value);
      drawDiskSchedulingGraph();
    }
  };

  // Validate and apply track size when input field loses focus
  const handleTrackSizeBlur = () => {
    // If empty or invalid, reset to minimum value
    if (trackSizeInput === '' || isNaN(parseInt(trackSizeInput, 10)) || parseInt(trackSizeInput, 10) < 10) {
      setTrackSizeInput('10');
      setTrackSizeValue(10);
      // Update startingTrackValue if needed
      if (startingTrackValue >= 10) {
        setStartingTrackValue(9);
        setStartingTrackInput('9');
      }
      drawDiskSchedulingGraph();
    }
  };

  // Validate and apply starting track when input field loses focus
  const handleStartingTrackBlur = () => {
    // If empty or invalid, reset to 0
    if (startingTrackInput === '' || isNaN(parseInt(startingTrackInput, 10))) {
      setStartingTrackInput('0');
      setStartingTrackValue(0);
      drawDiskSchedulingGraph();
    } 
    // If out of bounds, set to max valid value
    else if (parseInt(startingTrackInput, 10) >= trackSizeValue) {
      setStartingTrackInput((trackSizeValue - 1).toString());
      setStartingTrackValue(trackSizeValue - 1);
      drawDiskSchedulingGraph();
    }
  };

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = 400;
      drawDiskSchedulingGraph();
    }
    
    const handleResize = () => {
      if (canvas) {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = 400;
        drawDiskSchedulingGraph();
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle algorithm change
  const handleAlgorithmChange = (e) => {
    const newAlgorithm = e.target.value;
    setSelectedAlgorithm(newAlgorithm);
    
    // Recalculate the sequence for the new algorithm
    const newSequence = calculateSeekSequence(
      newAlgorithm,
      currentRequests,
      startingTrackValue,
      trackSizeValue,
      directionValue
    );
    
    // Update total steps based on the new sequence
    setTotalSteps(newSequence.length);
    
    // Reset the animation
    setCurrentStep(0);
    setSteps(0);
    setIsPlaying(false);
    setIsPaused(false);
    
    drawDiskSchedulingGraph();
  };

  return (
    <div className="disk-scheduling-visualization-container">
      <div className="layout-container">
        <div className="control-panel">
          <div className="section-box track-settings">
            <h3>Track size (min. 10)</h3>
            <input 
              type="text" 
              value={trackSizeInput}
              onChange={handleTrackSizeChange}
              onBlur={handleTrackSizeBlur}
              className="track-size-input"
            />
          </div>
          
          <div className="section-box starting-track-settings">
            <h3>Starting track (0-{trackSizeValue - 1})</h3>
            <input 
              type="text"
              value={startingTrackInput}
              onChange={handleStartingTrackChange}
              onBlur={handleStartingTrackBlur}
              className="starting-track-input"
            />
          </div>
          
          <div className="section-box spin-direction-settings">
            <h3>Spin direction</h3>
            <div className="radio-options">
              <div className="radio-option">
                <input 
                  type="radio" 
                  id="leftToRight" 
                  name="direction"
                  value="left-to-right"
                  checked={directionValue === 'left-to-right'}
                  onChange={() => {
                    setDirectionValue('left-to-right');
                    drawDiskSchedulingGraph();
                  }}
                />
                <label htmlFor="leftToRight">From left to right</label>
              </div>
              <div className="radio-option">
                <input 
                  type="radio" 
                  id="rightToLeft" 
                  name="direction"
                  value="right-to-left" 
                  checked={directionValue === 'right-to-left'}
                  onChange={() => {
                    setDirectionValue('right-to-left');
                    drawDiskSchedulingGraph();
                  }}
                />
                <label htmlFor="rightToLeft">From right to left</label>
              </div>
            </div>
          </div>
          
          <div className="section-box algorithm-settings">
            <h3>Algorithm</h3>
            <select 
              className="algorithm-dropdown"
              value={selectedAlgorithm}
              onChange={handleAlgorithmChange}
            >
              <option value="FCFS">FCFS</option>
              <option value="SSTF">SSTF</option>
              <option value="SCAN">SCAN</option>
              <option value="C-SCAN">C-SCAN</option>
              <option value="LOOK">LOOK</option>
              <option value="C-LOOK">C-LOOK</option>
            </select>
          </div>
          
          <div className="section-box custom-input-section">
            <h3>Seek Positions</h3>
            <div className="input-with-buttons">
              <input 
                type="text" 
                placeholder="Enter seek positions (comma separated)" 
                value={customInput}
                onChange={handleCustomInputChange}
                className="custom-input"
              />
              <div className="input-buttons">
                <button className="apply-btn" onClick={applyCustomInput}>Apply</button>
                <button className="random-btn" onClick={() => generateRandomInput()}>Random</button>
              </div>
            </div>
          </div>
          
          <div className="section-box animation-controls">
            <h3>Animation Controls</h3>
            <div className="button-row">
              <button className="control-btn start-btn" onClick={startAnimation} disabled={isPlaying || isPaused}>
                Start
              </button>
              <button 
                className={`control-btn ${isPlaying ? 'pause-btn' : 'resume-btn'}`} 
                onClick={togglePauseResume} 
                disabled={!isPlaying && !isPaused}
              >
                {isPlaying ? 'Pause' : 'Resume'}
              </button>
              <button className="control-btn reset-btn" onClick={resetAnimation}>
                Reset
              </button>
            </div>
          </div>
          
          <div className="section-box animation-progress">
            <h3>Animation Progress</h3>
            <div className="slider-container">
              <input 
                type="range" 
                min="0" 
                max={totalSteps} 
                value={steps}
                onChange={handleSliderChange}
                className="progress-slider"
              />
            </div>
            <div className="steps-counter">
              Steps: <span className="step-value">{steps}</span> / <span className="total-steps">{totalSteps}</span>
            </div>
          </div>
        </div>
        
        <div className="visualization-panel">
          <div className="canvas-container">
            <canvas ref={canvasRef}></canvas>
          </div>
          
          <div className="results-table">
            <table>
              <tbody>
                <tr>
                  <th>ALGORITHM</th>
                  <td>{selectedAlgorithm}</td>
                </tr>
                <tr>
                  <th>STARTING TRACK</th>
                  <td>{startingTrackValue}</td>
                </tr>
                <tr>
                  <th>SEEK QUEUE</th>
                  <td>{currentRequests.length > 0 ? currentRequests.join(', ') : 'No entries yet. Use "Apply" or "Random" to add seek positions.'}</td>
                </tr>
                {currentRequests.length > 0 && (
                  <tr>
                    <th>PROCESSED SEQUENCE</th>
                    <td>
                      {calculateSeekSequence(
                        selectedAlgorithm,
                        currentRequests,
                        startingTrackValue,
                        trackSizeValue,
                        directionValue
                      ).join(', ')}
                    </td>
                  </tr>
                )}
                {currentRequests.length > 0 && (
                  <tr>
                    <th>TOTAL SEEK MOVEMENTS</th>
                    <td>
                      {(() => {
                        const sequence = calculateSeekSequence(
                          selectedAlgorithm,
                          currentRequests,
                          startingTrackValue,
                          trackSizeValue,
                          directionValue
                        );
                        
                        // Calculate total head movement
                        let totalMovement = 0;
                        let current = startingTrackValue;
                        let calculationSteps = [];
                        
                        for (const pos of sequence) {
                          const movement = Math.abs(pos - current);
                          totalMovement += movement;
                          calculationSteps.push(`|${pos}-${current}|=${movement}`);
                          current = pos;
                        }
                        
                        return (
                          <div>
                            <div>{totalMovement} tracks</div>
                            <div className="calculation-steps">
                              {calculationSteps.join(' + ')} = {totalMovement}
                            </div>
                          </div>
                        );
                      })()}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiskSchedulingAnimation; 