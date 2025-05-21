import React from 'react';
import { Box, Typography, useTheme, Tooltip } from '@mui/material';
import { GanttData } from '../services/SimpleApi';

// Extended GanttData interface with optional properties
interface ExtendedGanttData extends GanttData {
  arrival_time?: number;
  priority?: number;
}

interface ReadyQueueVisualizationProps {
  ganttData: GanttData[];
  processColors: Record<string, string>;
  currentTime: number;
  isAnimating: boolean;
  algorithm: string; // To handle different queue behavior for different algorithms
}

// Function to determine the ready queue state at a given time for each algorithm
const getReadyQueue = (
  ganttData: GanttData[],
  currentTime: number,
  algorithm: string
): string[] => {
  // Extract all processes from gantt data
  const allProcesses = ganttData.map(d => ({
    process_id: d.process_id,
    start_time: d.start_time,
    end_time: d.end_time,
    arrival_time: (d as ExtendedGanttData).arrival_time || 0,
    priority: (d as ExtendedGanttData).priority !== undefined ? (d as ExtendedGanttData).priority : 0
  }));
  
  // Find unique processes
  const uniqueProcesses = Array.from(
    new Map(
      allProcesses.map(p => [p.process_id, p])
    ).values()
  );
  
  // Get process info (arrival, burst, end times) from gantt data
  const processInfo: Record<string, any> = {};
  uniqueProcesses.forEach(p => {
    const processBlocks = ganttData.filter(d => d.process_id === p.process_id);
    const totalBurst = processBlocks.reduce((sum, block) => sum + (block.end_time - block.start_time), 0);
    const firstStart = Math.min(...processBlocks.map(b => b.start_time));
    const lastEnd = Math.max(...processBlocks.map(b => b.end_time));
    
    processInfo[p.process_id] = {
      arrival_time: p.arrival_time,
      first_start: firstStart,
      last_end: lastEnd,
      total_burst: totalBurst,
      original_burst: totalBurst,
      priority: p.priority,
      // Get remaining time at current time
      remaining_time: (() => {
        let executedTime = 0;
        for (const block of processBlocks) {
          if (block.start_time <= currentTime) {
            executedTime += Math.min(currentTime - block.start_time, block.end_time - block.start_time);
          }
        }
        return totalBurst - executedTime;
      })()
    };
  });
  
  // Find the currently running process at currentTime
  const runningProcess = ganttData.find(d => 
    currentTime >= d.start_time && currentTime < d.end_time
  )?.process_id;
  
  // Determine which processes have arrived by currentTime 
  const arrivedProcesses = uniqueProcesses
    .filter(p => p.arrival_time <= currentTime)
    .map(p => p.process_id);
  
  // Get processes that have arrived but not completed
  const notCompletedProcesses = arrivedProcesses.filter(pid => 
    processInfo[pid].remaining_time > 0
  );
  
  // For FCFS algorithm
  if (algorithm === 'fcfs') {
    // Sort by arrival time, then by PID
    const sortedProcesses = [...notCompletedProcesses].sort((a, b) => {
      if (processInfo[a].arrival_time !== processInfo[b].arrival_time) {
        return processInfo[a].arrival_time - processInfo[b].arrival_time;
      }
      return a.localeCompare(b);
    });
    
    // Currently running process goes first
    if (runningProcess && sortedProcesses.includes(runningProcess)) {
      return [
        runningProcess,
        ...sortedProcesses.filter(p => p !== runningProcess)
      ];
    }
    return sortedProcesses;
  }
  
  // For SJF algorithm
  if (algorithm === 'sjf') {
    // For SJF, processes that have arrived are sorted by burst time
    const sortedProcesses = [...notCompletedProcesses].sort((a, b) => {
      if (processInfo[a].total_burst !== processInfo[b].total_burst) {
        return processInfo[a].total_burst - processInfo[b].total_burst;
      }
      if (processInfo[a].arrival_time !== processInfo[b].arrival_time) {
        return processInfo[a].arrival_time - processInfo[b].arrival_time;
      }
      return a.localeCompare(b);
    });
    
    // Currently running process goes first (non-preemptive)
    if (runningProcess && sortedProcesses.includes(runningProcess)) {
      return [
        runningProcess,
        ...sortedProcesses.filter(p => p !== runningProcess)
      ];
    }
    return sortedProcesses;
  }
  
  // For SRTF algorithm
  if (algorithm === 'srtf') {
    // Sort by remaining time, then by arrival, then by PID
    return [...notCompletedProcesses].sort((a, b) => {
      if (processInfo[a].remaining_time !== processInfo[b].remaining_time) {
        return processInfo[a].remaining_time - processInfo[b].remaining_time;
      }
      if (processInfo[a].arrival_time !== processInfo[b].arrival_time) {
        return processInfo[a].arrival_time - processInfo[b].arrival_time;
      }
      return a.localeCompare(b);
    });
  }
  
  // For Priority algorithm
  if (algorithm === 'priority' || algorithm === 'priority-preemptive') {
    // Check if this is preemptive priority scheduling
    const isPreemptive = algorithm === 'priority-preemptive';
    
    // Sort by priority (lower number = higher priority)
    const sortedProcesses = [...notCompletedProcesses].sort((a, b) => {
      if (processInfo[a].priority !== processInfo[b].priority) {
        return processInfo[a].priority - processInfo[b].priority;
      }
      if (processInfo[a].arrival_time !== processInfo[b].arrival_time) {
        return processInfo[a].arrival_time - processInfo[b].arrival_time;
      }
      return a.localeCompare(b);
    });
    
    // For non-preemptive, running process stays first
    if (!isPreemptive && runningProcess && sortedProcesses.includes(runningProcess)) {
      return [
        runningProcess,
        ...sortedProcesses.filter(p => p !== runningProcess)
      ];
    }
    
    return sortedProcesses;
  }
  
  // For Round Robin
  if (algorithm === 'round-robin') {
    // We need to simulate the RR queue based on arrival time and execution order
    
    // Build the RR queue
    const rrQueue: string[] = [];
    const processed = new Set<string>();
    
    // Add the process that's currently running
    if (runningProcess) {
      rrQueue.push(runningProcess);
      processed.add(runningProcess);
    }
    
    // Add processes that have arrived but haven't started yet, in arrival order
    const arrivedButNotStarted = notCompletedProcesses
      .filter(pid => processInfo[pid].first_start > currentTime || !ganttData.some(d => d.process_id === pid && d.start_time <= currentTime))
      .sort((a, b) => {
        if (processInfo[a].arrival_time !== processInfo[b].arrival_time) {
          return processInfo[a].arrival_time - processInfo[b].arrival_time;
        }
        return a.localeCompare(b);
      });
    
    // Add processes that have been preempted before, in order of last preemption
    const preemptedProcesses = notCompletedProcesses
      .filter(pid => pid !== runningProcess && 
              !arrivedButNotStarted.includes(pid) && 
              processInfo[pid].remaining_time > 0)
      .sort((a, b) => {
        const aLastEnd = Math.max(...ganttData
          .filter(d => d.process_id === a && d.end_time <= currentTime)
          .map(d => d.end_time));
        const bLastEnd = Math.max(...ganttData
          .filter(d => d.process_id === b && d.end_time <= currentTime)
          .map(d => d.end_time));
        return aLastEnd - bLastEnd;
      });
    
    // Add arrived but not started processes to queue
    for (const pid of arrivedButNotStarted) {
      if (!processed.has(pid)) {
        rrQueue.push(pid);
        processed.add(pid);
      }
    }
    
    // Add preempted processes to queue
    for (const pid of preemptedProcesses) {
      if (!processed.has(pid)) {
        rrQueue.push(pid);
        processed.add(pid);
      }
    }
    
    return rrQueue;
  }
  
  // Default fallback
  return notCompletedProcesses;
};

const ReadyQueueVisualization: React.FC<ReadyQueueVisualizationProps> = ({
  ganttData,
  processColors,
  currentTime,
  isAnimating,
  algorithm
}) => {
  const theme = useTheme();
  const readyQueue = getReadyQueue(ganttData, currentTime, algorithm);
  
  return (
    <Box 
      sx={{ 
        mt: { xs: 3, sm: 5 }, 
        pt: { xs: 2, sm: 4 }, 
        borderTop: '1px solid', 
        borderColor: 'rgba(159, 174, 240, 0.3)',
        borderRadius: '12px',
        padding: { xs: '12px', sm: '20px' },
        backgroundColor: '#EDF1FF',
        boxShadow: '0 6px 20px rgba(47, 75, 191, 0.08)',
        width: '100%', // Ensure it takes full width of parent
      }}
    >
      <Typography 
        variant="h6" 
        gutterBottom 
        sx={{ 
          fontWeight: 600, 
          color: '#1D3080',
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          fontSize: { xs: '1rem', sm: '1.25rem' }, // Smaller font on mobile
          flexWrap: 'wrap', // Allow wrapping on small screens
        }}
      >
        Ready Queue <Typography component="span" sx={{ color: '#435180', fontSize: { xs: '0.8rem', sm: '0.9rem' }, fontWeight: 'normal' }}>(Real-time)</Typography>
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2 }}>
        {/* Arrow visual for queue orientation */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 1.5, 
          color: '#435180',
          fontSize: { xs: '0.75rem', sm: '0.85rem' },
          gap: { xs: 1, sm: 1.5 },
          px: 1
        }}>
          <Box sx={{ fontWeight: 600 }}>CPU</Box>
          <Box sx={{ 
            flex: 1, 
            height: '2px', 
            background: 'linear-gradient(90deg, #2F4BBF 0%, rgba(159, 174, 240, 0.3) 100%)',
            position: 'relative' 
          }}>
            <Box sx={{ 
              position: 'absolute', 
              right: 0, 
              top: -5,
              color: '#2F4BBF',
              fontSize: '1.1rem'
            }}>
              ▶
            </Box>
          </Box>
          <Box sx={{ fontWeight: 500, opacity: 0.8 }}>Waiting</Box>
        </Box>
        
        {/* Ready Queue Visualization */}
        {readyQueue.length > 0 ? (
          <Box 
            sx={{
              display: 'flex',
              alignItems: 'center', 
              flexWrap: 'nowrap',
              overflowX: 'auto',
              gap: { xs: 1, sm: 1.5 },
              py: { xs: 2, sm: 3 },
              px: { xs: 1, sm: 2 },
              bgcolor: 'white',
              border: '1px solid rgba(159, 174, 240, 0.3)',
              borderRadius: '10px',
              boxShadow: 'inset 0 2px 6px rgba(47, 75, 191, 0.1)',
              '&::-webkit-scrollbar': {
                height: '8px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(159, 174, 240, 0.5)',
                borderRadius: '4px',
              },
              // Ensure a minimum height even when scrolling
              minHeight: '80px',
            }}
          >
            {readyQueue.map((processId, index) => {
              // First process is currently executing
              const isExecuting = index === 0;
              
              return (
                <Tooltip 
                  key={`${processId}-${index}`} 
                  title={isExecuting ? `${processId} (Currently Executing)` : processId}
                  arrow
                >
                  <Box
                    sx={{
                      minWidth: { xs: 48, sm: 56 },
                      height: { xs: 48, sm: 56 },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      bgcolor: processColors[processId],
                      borderRadius: '10px',
                      border: isExecuting ? `2px solid ${theme.palette.common.black}` : 'none',
                      boxShadow: isExecuting 
                        ? '0 0 16px rgba(47, 75, 191, 0.4)' 
                        : '0 3px 10px rgba(0, 0, 0, 0.1)',
                      transform: isExecuting ? 'scale(1.12)' : 'none',
                      position: 'relative',
                      transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      '&:hover': {
                        transform: isExecuting ? 'scale(1.15)' : 'translateY(-5px)',
                        boxShadow: '0 6px 14px rgba(0, 0, 0, 0.15)',
                      },
                      flexShrink: 0, // Prevent process boxes from shrinking
                    }}
                  >
                    {processId}
                    {isExecuting && (
                      <Box 
                        sx={{
                          position: 'absolute',
                          top: -24,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          color: '#2F4BBF',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          whiteSpace: 'nowrap',
                          backgroundColor: 'rgba(237, 241, 255, 0.9)',
                          px: 1,
                          py: 0.3,
                          borderRadius: '4px',
                          border: '1px solid rgba(159, 174, 240, 0.4)',
                          display: { xs: 'none', sm: 'block' }, // Hide on mobile to save space
                        }}
                      >
                        Running
                      </Box>
                    )}
                  </Box>
                </Tooltip>
              );
            })}
          </Box>
        ) : (
          <Box 
            sx={{ 
              p: { xs: 2, sm: 3 }, 
              textAlign: 'center', 
              color: '#435180',
              bgcolor: 'white',
              border: '1px solid rgba(159, 174, 240, 0.3)',
              borderRadius: '10px',
              fontWeight: 500
            }}
          >
            No processes in ready queue at time {currentTime}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ReadyQueueVisualization; 