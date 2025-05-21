import React, { useEffect, useState } from 'react';
import { Box, Typography, useTheme, Tooltip } from '@mui/material';
import { GanttData } from '../services/SimpleApi';

interface TimelineChartProps {
  ganttData: GanttData[];
  currentTime: number;
  processColors: Record<string, string>;
  title?: string;
}

interface TimelineData {
  processId: string;
  startTime: number;
  endTime: number;
  active: boolean;
}

const TimelineChart: React.FC<TimelineChartProps> = ({
  ganttData,
  currentTime,
  processColors,
  title
}) => {
  const theme = useTheme();
  const [timelineData, setTimelineData] = useState<Record<string, TimelineData[]>>({});
  
  // Prepare data for timeline visualization
  useEffect(() => {
    const processTimeline: Record<string, TimelineData[]> = {};
    
    // Group gantt data by process ID
    ganttData.forEach(block => {
      if (!processTimeline[block.process_id]) {
        processTimeline[block.process_id] = [];
      }
      
      processTimeline[block.process_id].push({
        processId: block.process_id,
        startTime: block.start_time,
        endTime: block.end_time,
        active: currentTime >= block.start_time && currentTime < block.end_time
      });
    });
    
    // Sort timeline entries by start time
    Object.keys(processTimeline).forEach(processId => {
      processTimeline[processId].sort((a, b) => a.startTime - b.startTime);
    });
    
    setTimelineData(processTimeline);
  }, [ganttData, currentTime]); // Removed timelineData dependency
  
  // Find start and end times for visualization
  const startTime = Math.min(...ganttData.map(d => d.start_time));
  const endTime = Math.max(...ganttData.map(d => d.end_time));
  
  // Maximum width of the chart
  const maxWidth = 800;
  
  // Scale factor for converting time to pixels
  // Ensure we have at least 1 pixel difference to avoid division by zero issues
  const scaleFactor = maxWidth / Math.max(1, endTime - startTime);
  
  // For time scale display, ensure we have a minimum span if start and end are too close
  const effectiveTimeSpan = Math.max(1, endTime - startTime);
  
  // Sort process IDs for consistent display
  const sortedProcessIds = Object.keys(timelineData).sort();
  
  // Handle edge case when no processes or empty gantt data
  if (ganttData.length === 0 || sortedProcessIds.length === 0) {
    return (
      <Box sx={{ mt: 4, mb: 2, p: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No process data available to display timeline.
        </Typography>
      </Box>
    );
  }
  
  return (
    <Box sx={{ mt: 4, mb: 2 }}>
      {title && (
        <Typography variant="h6" gutterBottom sx={{ 
          fontWeight: 600, 
          color: theme.palette.primary.main,
          textAlign: 'center',
          mb: 2
        }}>
          {title}
        </Typography>
      )}
      
      <Box sx={{ 
        maxWidth: maxWidth, 
        mx: 'auto',
        p: 2,
        bgcolor: 'rgba(237, 241, 255, 0.6)',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
        border: '1px solid rgba(159, 174, 240, 0.2)',
      }}>
        <Typography variant="body2" sx={{ mb: 2, fontWeight: 500, color: '#435180' }}>
          This timeline shows when each process was executed on the CPU over time:
        </Typography>
        
        {sortedProcessIds.map((processId) => (
          <Box key={processId} sx={{ mb: 2, position: 'relative' }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              mb: 0.5
            }}>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  bgcolor: processColors[processId],
                  borderRadius: '4px',
                  mr: 1,
                  border: '1px solid rgba(0,0,0,0.1)',
                }}
              />
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 600,
                  color: '#1F2A4B',
                }}
              >
                {processId}
              </Typography>
            </Box>
            
            <Box sx={{ 
              height: '30px',
              width: '100%',
              position: 'relative',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '8px',
              border: '1px solid rgba(159, 174, 240, 0.3)',
            }}>
              {timelineData[processId]?.map((segment, index) => (
                <Tooltip
                  key={index}
                  title={`${processId}: ${segment.startTime} - ${segment.endTime}`}
                  arrow
                  placement="top"
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      left: `${((segment.startTime - startTime) * scaleFactor)}px`,
                      width: `${Math.max(3, (segment.endTime - segment.startTime) * scaleFactor)}px`,
                      height: '20px',
                      top: '5px',
                      bgcolor: processColors[processId],
                      opacity: currentTime >= segment.endTime ? 0.7 : 1,
                      border: segment.active ? '2px solid black' : '1px solid rgba(0,0,0,0.1)',
                      boxShadow: segment.active ? '0 0 8px rgba(0,0,0,0.3)' : 'none',
                      borderRadius: '4px',
                    }}
                  />
                </Tooltip>
              ))}
              
              {/* Current time indicator */}
              {currentTime > startTime && currentTime <= endTime && (
                <Box
                  sx={{
                    position: 'absolute',
                    height: '100%',
                    width: '2px',
                    bgcolor: 'error.main',
                    left: `${((currentTime - startTime) * scaleFactor)}px`,
                    zIndex: 2,
                    boxShadow: '0 0 5px rgba(255,0,0,0.5)',
                  }}
                />
              )}
            </Box>
          </Box>
        ))}
        
        {/* Time scale */}
        <Box sx={{ 
          position: 'relative',
          height: '24px',
          mt: 1,
          mb: 1,
          borderTop: '1px solid rgba(159, 174, 240, 0.5)',
        }}>
          {startTime === endTime ? (
            // Special case for when startTime and endTime are the same
            <Box
              sx={{
                position: 'absolute',
                left: '50%',
                top: 0,
                height: '6px',
                width: '1px',
                bgcolor: 'rgba(159, 174, 240, 0.8)',
              }}
            />
          ) : (
            // Normal case: draw tick marks for each time unit
            Array.from({ length: effectiveTimeSpan + 1 }).map((_, index) => (
              <Box
                key={index}
                sx={{
                  position: 'absolute',
                  left: `${index * scaleFactor}px`,
                  top: 0,
                  height: '6px',
                  width: '1px',
                  bgcolor: 'rgba(159, 174, 240, 0.8)',
                }}
              />
            ))
          )}
          
          {/* Time labels - show fewer labels for readability */}
          {Array.from({ length: Math.min(10, effectiveTimeSpan + 1) }).map((_, index) => {
            const timeValue = startTime + Math.floor(index * (effectiveTimeSpan / Math.min(9, effectiveTimeSpan)));
            return (
              <Typography
                key={index}
                variant="caption"
                sx={{
                  position: 'absolute',
                  left: `${((timeValue - startTime) * scaleFactor)}px`,
                  top: '8px',
                  fontSize: '0.7rem',
                  color: '#435180',
                  transform: 'translateX(-50%)',
                }}
              >
                {timeValue}
              </Typography>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default TimelineChart; 