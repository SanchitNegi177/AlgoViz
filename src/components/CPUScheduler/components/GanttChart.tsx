import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Paper, Typography, useTheme, Tooltip } from '@mui/material';
import { GanttData } from '../services/SimpleApi.ts';
import ReadyQueueVisualization from './ReadyQueueVisualization.tsx';
import TimelineChart from './TimelineChart.tsx';

interface GanttChartProps {
  data: GanttData[];
  title?: string;
  autoPlay?: boolean;
  algorithm?: string;
}

// Custom color palette for better visualization - updated to match new theme
const colors = [
  '#5A7CFF', // Primary blue
  '#42DDFF', // Bright cyan
  '#FF9E42', // Vibrant orange
  '#9FAEF0', // Light blue-purple
  '#A25AFF', // Bright purple
  '#FFCD80', // Yellow
  '#2F4BBF', // Deep blue
  '#FF6B6B', // Vibrant red
  '#65D587', // Bright green
  '#8CEBFF', // Light blue
  '#FF7E7E', // Soft red
  '#BE9AFF', // Lavender
  '#FFE566', // Light yellow
  '#A0F0B4', // Light green
  '#7BA9FF', // Sky blue
];

// Function to calculate completion times for each process
const calculateCompletionTimes = (data: GanttData[]) => {
  const completionTimes: Record<string, number> = {};
  
  // Group by process_id and find the latest end_time for each process
  data.forEach(block => {
    if (!completionTimes[block.process_id] || block.end_time > completionTimes[block.process_id]) {
      completionTimes[block.process_id] = block.end_time;
    }
  });
  
  return completionTimes;
};

const GanttChart: React.FC<GanttChartProps> = ({ data, title, autoPlay = true, algorithm = 'fcfs' }) => {
  const theme = useTheme();
  const processIds = Array.from(new Set(data.map(d => d.process_id)));
  const [currentTime, setCurrentTime] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const isFirstRender = useRef(true);
  
  // Calculate process completion times
  const completionTimes = calculateCompletionTimes(data);
  
  // Find start and end times
  const startTime = Math.min(...data.map(d => d.start_time));
  const endTime = Math.max(...data.map(d => d.end_time));
  
  // Maximum width of the chart
  const maxWidth = 800;
  
  // Scale factor for converting time to pixels
  const scaleFactor = maxWidth / Math.max(1, endTime - startTime);
  
  // Map process IDs to colors
  const processColors: Record<string, string> = {};
  processIds.forEach((id, index) => {
    processColors[id] = colors[index % colors.length];
  });
  
  // Check if the algorithm is preemptive
  const isPreemptive = algorithm === 'srtf' || algorithm === 'priority-preemptive' || algorithm === 'round-robin';
  
  // Create time markers
  const timeMarkers: number[] = [];
  // Limit the number of markers to avoid overcrowding
  const markerCount = Math.min(Math.max(5, endTime - startTime), 20);
  // Ensure markerStep is at least 1 to prevent infinite loops
  const markerStep = Math.max(1, Math.ceil((endTime - startTime) / (markerCount - 1)));
  
  // Handle case where startTime and endTime are the same
  if (startTime === endTime) {
    timeMarkers.push(startTime);
  } else {
    for (let i = startTime; i <= endTime; i += markerStep) {
      timeMarkers.push(i);
    }
    
    // Make sure the last marker is included
    if (timeMarkers[timeMarkers.length - 1] !== endTime) {
      timeMarkers.push(endTime);
    }
  }
  
  // Function definitions with useCallback
  // Start animation
  const handleStartAnimation = useCallback(() => {
    setCurrentTime(startTime);
    setIsAnimating(true);
    setIsPaused(false);
  }, [startTime]); // Only depends on startTime which is derived from data
  
  // Pause/resume animation
  const handleTogglePause = useCallback(() => {
    setIsPaused(!isPaused);
  }, [isPaused]);
  
  // Reset animation
  const handleResetAnimation = useCallback(() => {
    setIsAnimating(false);
    setCurrentTime(startTime);
  }, [startTime]);
  
  // Auto-start animation on first render if autoPlay is true
  useEffect(() => {
    if (autoPlay && isFirstRender.current) {
      isFirstRender.current = false;
      setTimeout(() => {
        handleStartAnimation();
      }, 800); // Slight delay for better UX
    }
  }, [autoPlay, handleStartAnimation]);
  
  // Animation effect
  useEffect(() => {
    let animationFrame: number;
    let lastTimestamp = 0;
    const animationSpeed = 800; // ms per time unit - slightly faster for better UX
    
    const animate = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      
      const elapsed = timestamp - lastTimestamp;
      
      if (elapsed > animationSpeed && !isPaused) {
        lastTimestamp = timestamp;
        setCurrentTime(prev => {
          const next = prev + 1;
          if (next > endTime) {
            setIsAnimating(false);
            return endTime;
          }
          return next;
        });
      }
      
      if (isAnimating) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    if (isAnimating) {
      animationFrame = requestAnimationFrame(animate);
    }
    
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [isAnimating, isPaused, endTime]);
  
  return (
    <Paper sx={{ 
      p: { xs: 2, sm: 3 }, 
      my: 2, 
      boxShadow: '0 10px 30px rgba(47, 75, 191, 0.1)',
      borderRadius: '16px',
      border: '1px solid rgba(159, 174, 240, 0.2)',
      overflow: 'hidden', // Add overflow hidden to prevent content from exceeding container
    }}>
      {title && (
        <Typography variant="h5" gutterBottom sx={{ mb: 2, fontWeight: 600, color: '#1D3080' }}>
          {title}
        </Typography>
      )}
      
      {/* Animation controls */}
      <Box sx={{ 
        display: 'flex', 
        gap: { xs: 1, sm: 2 }, 
        mb: 3, 
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        p: { xs: 1, sm: 2 },
        backgroundColor: '#EDF1FF',
        borderRadius: '10px',
        border: '1px solid rgba(159, 174, 240, 0.3)',
      }}>
        <button 
          onClick={handleStartAnimation} 
          disabled={isAnimating && !isPaused}
          style={{ 
            padding: '8px 16px', 
            background: 'linear-gradient(135deg, #2F4BBF 0%, #5A7CFF 100%)', 
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            opacity: (isAnimating && !isPaused) ? 0.7 : 1,
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(47, 75, 191, 0.25)',
          }}
        >
          Start Animation
        </button>
        {isAnimating && (
          <button 
            onClick={handleTogglePause}
            style={{ 
              padding: '8px 16px', 
              background: '#9FAEF0', 
              color: '#1D3080',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(47, 75, 191, 0.15)',
            }}
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
        )}
        <button 
          onClick={handleResetAnimation}
          style={{ 
            padding: '8px 16px', 
            background: '#EDF1FF', 
            color: '#435180',
            border: '1px solid rgba(159, 174, 240, 0.5)',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Reset
        </button>
        <Box sx={{ 
          ml: { xs: 0, sm: 1 }, 
          px: 2, 
          py: 1, 
          borderRadius: '8px', 
          backgroundColor: 'white',
          border: '1px solid rgba(159, 174, 240, 0.4)',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(47, 75, 191, 0.08)',
        }}>
          <Typography variant="body1" sx={{ mr: 1, color: '#435180', fontWeight: 500 }}>
            Time:
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 700, color: '#2F4BBF' }}>
            {currentTime}
          </Typography>
        </Box>
      </Box>
      
      {/* Color Legend - Display only once at the top */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          mb: 3,
          gap: 1.5,
          justifyContent: 'center',
          backgroundColor: '#EDF1FF',
          borderRadius: '10px',
          border: '1px solid rgba(159, 174, 240, 0.3)',
          padding: { xs: '8px', sm: '12px' },
        }}
      >
        {processIds.map((id) => (
          <Box
            key={id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              padding: '4px 8px',
              borderRadius: '8px',
              backgroundColor: 'white',
              border: '1px solid rgba(159, 174, 240, 0.3)',
              boxShadow: '0 2px 6px rgba(47, 75, 191, 0.06)',
              ...(isAnimating && currentTime >= completionTimes[id] && {
                backgroundColor: 'rgba(101, 213, 135, 0.2)',
                borderColor: 'rgba(101, 213, 135, 0.5)',
              }),
            }}
          >
            <Box
              sx={{
                width: 16,
                height: 16,
                bgcolor: processColors[id],
                borderRadius: '4px',
                border: '1px solid rgba(0,0,0,0.05)',
              }}
            />
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: isAnimating && currentTime >= completionTimes[id] ? 600 : 500,
                color: '#1F2A4B',
                fontSize: '0.85rem',
              }}
            >
              {id} 
              {isAnimating && currentTime >= completionTimes[id] && " ✓"}
            </Typography>
          </Box>
        ))}
      </Box>
      
      <Box sx={{ 
        position: 'relative', 
        maxWidth: maxWidth, 
        mx: 'auto',
        pb: 1,
        overflowX: 'auto', // Add horizontal scrolling for small screens
        overflowY: 'hidden', // Prevent vertical scrolling
        '&::-webkit-scrollbar': {
          height: '8px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(159, 174, 240, 0.5)',
          borderRadius: '4px',
        },
      }}>
        {/* Wrap the visualization in a minimum width container to ensure it doesn't get too compressed */}
        <Box sx={{ minWidth: Math.min(maxWidth, Math.max(300, (endTime - startTime) * 30)) }}>
          {/* Time scale container with padding to ensure markers are visible */}
          <Box sx={{ 
            position: 'relative',
            pt: 4, // Add padding top to ensure time markers are visible
            pb: 1, // Add padding bottom for time ticks
            mb: 1,
            mt: { xs: 1, sm: 2 }, // Add more top margin on larger screens
            borderRadius: '8px',
            backgroundColor: 'rgba(237, 241, 255, 0.5)', // Light background to highlight the scale
            border: '1px solid rgba(159, 174, 240, 0.2)', // Subtle border
            boxShadow: '0 2px 8px rgba(47, 75, 191, 0.05)', // Light shadow for depth
          }}>
            {/* Time markers */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              mb: 1,
              px: 2, // Add horizontal padding to ensure edge markers are visible
            }}>
              {timeMarkers.map((time) => (
                <Typography
                  key={time}
                  variant="caption"
                  sx={{
                    position: 'absolute',
                    left: `${((time - startTime) * scaleFactor)}px`,
                    transform: 'translateX(-50%)',
                    top: 8, // Adjusted to be visible within the scale container
                    fontWeight: time === currentTime ? 'bold' : 'normal',
                    color: time === currentTime ? '#2F4BBF' : '#435180',
                    fontSize: { xs: '0.65rem', sm: '0.75rem' }, // Responsive font size
                    px: 0.5, // Add horizontal padding to make numbers more readable
                    py: 0.2, // Add vertical padding
                    backgroundColor: time === currentTime ? 'rgba(159, 174, 240, 0.2)' : 'transparent', // Highlight current time
                    borderRadius: '3px',
                    zIndex: 2, // Ensure it's above the axis line
                  }}
                >
                  {time}
                </Typography>
              ))}
            </Box>
            
            {/* Time axis line */}
            <Box
              sx={{
                height: '3px', // Slightly thicker line for better visibility
                background: 'linear-gradient(90deg, rgba(159, 174, 240, 0.3) 0%, rgba(159, 174, 240, 0.6) 50%, rgba(159, 174, 240, 0.3) 100%)',
                width: '100%',
                mb: 1,
                position: 'relative', // For proper positioning of ticks
                zIndex: 1,
              }}
            />
            
            {/* Time markers ticks */}
            {timeMarkers.map((time) => (
              <Box
                key={time}
                sx={{
                  position: 'absolute',
                  height: '10px',
                  width: '2px',
                  bgcolor: time === currentTime ? '#2F4BBF' : 'rgba(159, 174, 240, 0.6)',
                  left: `${((time - startTime) * scaleFactor)}px`,
                  bottom: 5, // Position from bottom of container
                  transform: 'translateX(-50%)',
                  zIndex: 2, // Ensure ticks are above the axis line
                }}
              />
            ))}
            
            {/* Scale label */}
            <Typography
              variant="caption"
              sx={{
                position: 'absolute',
                right: 8,
                top: 2,
                fontSize: { xs: '0.6rem', sm: '0.7rem' },
                color: '#435180',
                fontStyle: 'italic',
              }}
            >
              Time Scale
            </Typography>
          </Box>
          
          {/* Current time indicator */}
          {isAnimating && (
            <Box
              sx={{
                position: 'absolute',
                height: '120px', // Increased height to cover the time scale and process blocks
                width: '2px',
                background: 'linear-gradient(to bottom, #FF6B6B, rgba(255, 107, 107, 0.4))',
                left: `${((currentTime - startTime) * scaleFactor)}px`,
                top: -5, // Adjusted to align with the time scale
                zIndex: 5,
                transition: 'left 0.3s ease',
                boxShadow: '0 0 12px rgba(255, 107, 107, 0.5)',
                '&::after': { // Add a pulse effect circle
                  content: '""',
                  position: 'absolute',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#FF6B6B',
                  top: 0,
                  left: '-3px',
                  animation: 'pulse 1.5s infinite',
                  boxShadow: '0 0 8px #FF6B6B',
                },
                '@keyframes pulse': {
                  '0%': {
                    transform: 'scale(1)',
                    opacity: 1,
                  },
                  '50%': {
                    transform: 'scale(1.5)',
                    opacity: 0.7,
                  },
                  '100%': {
                    transform: 'scale(1)',
                    opacity: 1,
                  },
                },
              }}
            />
          )}
        </Box>
        
        {/* Ready Queue Visualization */}
        {isAnimating && (
          <ReadyQueueVisualization
            ganttData={data}
            currentTime={currentTime}
            processColors={processColors}
            algorithm={algorithm}
            isAnimating={isAnimating}
          />
        )}
        
        {/* Process blocks container with proper spacing */}
        <Box sx={{ 
          position: 'relative', 
          height: '65px', 
          mt: 2,
          mx: 'auto',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'flex-start',
          minWidth: Math.min(maxWidth, Math.max(300, (endTime - startTime) * 30)), // Ensure minimum width
          borderRadius: '8px',
          padding: '8px 0',
          backgroundColor: 'rgba(255, 255, 255, 0.5)', // Light background to match the scale
          border: '1px solid rgba(159, 174, 240, 0.2)', // Subtle border to match scale
          boxShadow: '0 2px 8px rgba(47, 75, 191, 0.05)', // Light shadow for depth
        }}>
          {data.map((block, index) => {
            // Determine if this block is currently active
            const isActive = isAnimating && 
                             currentTime >= block.start_time && 
                             currentTime < block.end_time;
                             
            // Determine how much of this block is completed
            const completionRatio = isAnimating && currentTime > block.start_time
              ? Math.min(1, (currentTime - block.start_time) / (block.end_time - block.start_time))
              : 0;
            
            // Calculate if the process is fully completed
            const isProcessCompleted = currentTime >= completionTimes[block.process_id];
            
            return (
              <Tooltip 
                key={index} 
                title={`${block.process_id}: ${block.start_time} - ${block.end_time} (Duration: ${block.end_time - block.start_time})`}
                placement="top"
                arrow
              >
                <Box
                  sx={{
                    position: 'absolute',
                    left: `${((block.start_time - startTime) * scaleFactor)}px`,
                    width: `${((block.end_time - block.start_time) * scaleFactor)}px`,
                    height: '100%',
                    bgcolor: processColors[block.process_id],
                    opacity: isAnimating ? (currentTime >= block.start_time ? 1 : 0.5) : 1,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px',
                    border: isActive ? `2px solid ${theme.palette.common.black}` : '1px solid rgba(0,0,0,0.05)',
                    boxShadow: isActive 
                      ? '0 0 20px rgba(47, 75, 191, 0.35)' 
                      : '0 4px 8px rgba(0,0,0,0.08)',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease, opacity 0.5s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
                      transform: 'translateY(-2px)',
                      zIndex: 10,
                    },
                  }}
                >
                  {/* Completion overlay */}
                  {isAnimating && completionRatio > 0 && completionRatio < 1 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '100%',
                        width: `${completionRatio * 100}%`,
                        background: 'rgba(255, 255, 255, 0.3)',
                        zIndex: 1,
                        borderRight: '1px dashed rgba(255, 255, 255, 0.6)',
                      }}
                    />
                  )}
                  
                  {/* Completed checkmark - Only show checkmark without changing block color */}
                  {isAnimating && isProcessCompleted && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 5,
                        right: 5,
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        bgcolor: 'rgba(101, 213, 135, 0.9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 2,
                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                      }}
                    >
                      <Typography 
                        sx={{ 
                          fontSize: '12px', 
                          color: 'white', 
                          fontWeight: 'bold',
                          lineHeight: 1,
                        }}
                      >
                        ✓
                      </Typography>
                    </Box>
                  )}
                  
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 'bold',
                      textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                      whiteSpace: 'nowrap',
                      zIndex: 2,
                      fontSize: '0.85rem',
                    }}
                  >
                    {block.process_id}
                  </Typography>
                </Box>
              </Tooltip>
            );
          })}
        </Box>
        
        {/* For preemptive algorithms, add timeline chart */}
        {isPreemptive && (
          <TimelineChart
            ganttData={data}
            currentTime={currentTime}
            processColors={processColors}
            title="Process Timeline"
          />
        )}
      </Box>
    </Paper>
  );
};

export default GanttChart; 