import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Result } from '../services/SimpleApi';

interface ResultsTableProps {
  results: Result[];
  avgWaitingTime: number;
  avgTurnaroundTime: number;
  title?: string;
}

const ResultsTable: React.FC<ResultsTableProps> = ({
  results,
  avgWaitingTime,
  avgTurnaroundTime,
  title,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Determine which columns to show based on the data
  const showPriority = results.some(result => result.priority !== undefined);
  const showArrivalTime = results.some(result => result.arrival_time !== undefined);
  const showCompletionTime = results.some(result => result.completion_time !== undefined);

  return (
    <Paper sx={{ 
      p: { xs: 2, sm: 3 }, 
      my: 3,
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      overflow: 'hidden',
    }}>
      {title && (
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ 
            mb: { xs: 2, sm: 3 }, 
            fontWeight: 500, 
            color: theme.palette.primary.main,
            pb: 1,
            borderBottom: `1px solid ${theme.palette.divider}`,
            fontSize: { xs: '1.1rem', sm: '1.25rem' }, // Smaller font on mobile
          }}
        >
          {title}
        </Typography>
      )}
      
      <TableContainer sx={{ 
        borderRadius: '6px', 
        mb: 3,
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        border: `1px solid ${theme.palette.divider}`,
        // Add horizontal scrolling on mobile for table
        maxWidth: '100%',
        overflowX: 'auto',
        '&::-webkit-scrollbar': {
          height: '8px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '4px',
        },
      }}>
        <Table size={isMobile ? "small" : "medium"} stickyHeader>
          <TableHead sx={{ bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.02)' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', padding: { xs: '8px', sm: '16px' }, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>Process ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', padding: { xs: '8px', sm: '16px' }, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>Burst Time</TableCell>
              {showArrivalTime && <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', padding: { xs: '8px', sm: '16px' }, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>Arrival Time</TableCell>}
              {showPriority && <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', padding: { xs: '8px', sm: '16px' }, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>Priority</TableCell>}
              {showCompletionTime && <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', padding: { xs: '8px', sm: '16px' }, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>Completion Time</TableCell>}
              <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', padding: { xs: '8px', sm: '16px' }, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>Waiting Time</TableCell>
              <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', padding: { xs: '8px', sm: '16px' }, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>Turnaround Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((result, index) => (
              <TableRow 
                key={result.process_id}
                sx={{ 
                  '&:nth-of-type(odd)': { 
                    bgcolor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.03)' 
                      : 'rgba(0, 0, 0, 0.01)' 
                  },
                  '&:hover': {
                    bgcolor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.08)' 
                      : 'rgba(0, 0, 0, 0.04)'
                  },
                  transition: 'background-color 0.2s',
                }}
              >
                <TableCell sx={{ 
                  fontWeight: 'bold',
                  color: theme.palette.primary.main,
                  padding: { xs: '8px', sm: '16px' },
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                }}>
                  {result.process_id}
                </TableCell>
                <TableCell sx={{ padding: { xs: '8px', sm: '16px' }, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                  {result.burst_time}
                </TableCell>
                {showArrivalTime && <TableCell sx={{ padding: { xs: '8px', sm: '16px' }, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                  {result.arrival_time !== undefined ? result.arrival_time : 'N/A'}
                </TableCell>}
                {showPriority && (
                  <TableCell sx={{ padding: { xs: '8px', sm: '16px' }, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                    {result.priority !== undefined ? (
                      <Chip 
                        label={result.priority} 
                        size="small" 
                        sx={{ 
                          fontWeight: 'bold',
                          bgcolor: 'rgba(156, 39, 176, 0.1)',
                          color: '#9c27b0',
                          height: { xs: '20px', sm: '24px' }, // Smaller on mobile
                          fontSize: { xs: '0.7rem', sm: '0.75rem' }, // Smaller font on mobile
                        }} 
                      />
                    ) : 'N/A'}
                  </TableCell>
                )}
                {showCompletionTime && <TableCell sx={{ padding: { xs: '8px', sm: '16px' }, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                  {result.completion_time}
                </TableCell>}
                <TableCell sx={{ 
                  fontWeight: result.waiting_time === Math.min(...results.map(r => r.waiting_time)) ? 'bold' : 'normal',
                  color: result.waiting_time === Math.min(...results.map(r => r.waiting_time)) ? '#4caf50' : 
                         result.waiting_time === Math.max(...results.map(r => r.waiting_time)) ? '#f44336' : 'inherit',
                  padding: { xs: '8px', sm: '16px' },
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                }}>
                  {result.waiting_time}
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: result.turnaround_time === Math.min(...results.map(r => r.turnaround_time)) ? 'bold' : 'normal',
                  color: result.turnaround_time === Math.min(...results.map(r => r.turnaround_time)) ? '#4caf50' : 
                         result.turnaround_time === Math.max(...results.map(r => r.turnaround_time)) ? '#f44336' : 'inherit',
                  padding: { xs: '8px', sm: '16px' },
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                }}>
                  {result.turnaround_time}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        flexWrap: 'wrap', 
        gap: { xs: 2, sm: 4 }, 
        justifyContent: 'center',
        alignItems: 'center',
        p: { xs: 1.5, sm: 2 },
        bgcolor: theme.palette.mode === 'dark' ? 'rgba(66, 66, 66, 0.2)' : '#f8f9fa',
        borderRadius: '6px',
        border: '1px solid',
        borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1, 
          flexDirection: 'column',
          bgcolor: theme.palette.background.paper,
          px: { xs: 2, sm: 3 },
          py: 1.5,
          borderRadius: '6px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          border: '1px solid',
          borderColor: theme.palette.divider,
          width: { xs: '100%', sm: 'auto' }, // Full width on mobile
        }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
            Average Waiting Time
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.primary.main, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
            {avgWaitingTime.toFixed(2)}
          </Typography>
        </Box>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1, 
          flexDirection: 'column',
          bgcolor: theme.palette.background.paper,
          px: { xs: 2, sm: 3 },
          py: 1.5,
          borderRadius: '6px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          border: '1px solid',
          borderColor: theme.palette.divider,
          width: { xs: '100%', sm: 'auto' }, // Full width on mobile
        }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
            Average Turnaround Time
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.secondary.main, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
            {avgTurnaroundTime.toFixed(2)}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default ResultsTable; 