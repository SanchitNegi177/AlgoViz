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
  Grid,
  Card,
  CardContent,
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
    <Box sx={{ my: 3 }}>
      {title && (
        <Typography 
          variant="h5" 
          gutterBottom 
          sx={{ 
            mb: 3, 
            fontWeight: 600, 
            color: '#25316d',
            fontSize: { xs: '1.3rem', sm: '1.5rem' },
          }}
        >
          {title}
        </Typography>
      )}

      {/* Scheduling Results Cards with Light Background */}
      <Box sx={{
        background: 'linear-gradient(135deg, rgba(165, 180, 252, 0.1) 0%, rgba(192, 132, 252, 0.15) 100%)',
        borderRadius: '16px',
        p: 3,
        mb: 4,
        border: '1px solid rgba(255, 255, 255, 0.3)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(99, 102, 241, 0.1)',
      }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.5)',
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="body2" sx={{ 
                  color: '#6B7280', 
                  mb: 1, 
                  fontWeight: 600,
                  fontSize: '0.9rem'
                }}>
                  Average Waiting Time
                </Typography>
                <Typography variant="h4" sx={{ 
                  fontWeight: 800, 
                  color: '#1F2937',
                  fontSize: { xs: '1.8rem', sm: '2.125rem' }
                }}>
                  {avgWaitingTime.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.5)',
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="body2" sx={{ 
                  color: '#6B7280', 
                  mb: 1, 
                  fontWeight: 600,
                  fontSize: '0.9rem'
                }}>
                  Average Turnaround Time
                </Typography>
                <Typography variant="h4" sx={{ 
                  fontWeight: 800, 
                  color: '#1F2937',
                  fontSize: { xs: '1.8rem', sm: '2.125rem' }
                }}>
                  {avgTurnaroundTime.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.5)',
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="body2" sx={{ 
                  color: '#6B7280', 
                  mb: 1, 
                  fontWeight: 600,
                  fontSize: '0.9rem'
                }}>
                  Total Processes
                </Typography>
                <Typography variant="h4" sx={{ 
                  fontWeight: 800, 
                  color: '#1F2937',
                  fontSize: { xs: '1.8rem', sm: '2.125rem' }
                }}>
                  {results.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.5)',
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="body2" sx={{ 
                  color: '#6B7280', 
                  mb: 1, 
                  fontWeight: 600,
                  fontSize: '0.9rem'
                }}>
                  CPU Utilization
                </Typography>
                <Typography variant="h4" sx={{ 
                  fontWeight: 800, 
                  color: '#1F2937',
                  fontSize: { xs: '1.8rem', sm: '2.125rem' }
                }}>
                  100.0%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Process Details Table */}
      <Paper sx={{ 
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        overflow: 'hidden',
      }}>
        <Box sx={{ 
          p: 3, 
          background: 'linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 100%)',
          borderBottom: '1px solid #DEE2E6'
        }}>
          <Typography variant="h6" sx={{ 
            fontWeight: 600, 
            color: '#25316d',
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
          }}>
            Processes:
          </Typography>
        </Box>
        
        <TableContainer sx={{ 
          maxWidth: '100%',
          overflowX: 'auto',
        }}>
          <Table size={isMobile ? "small" : "medium"}>
            <TableHead sx={{ bgcolor: '#F8F9FA' }}>
              <TableRow>
                <TableCell sx={{ 
                  fontWeight: 700, 
                  color: '#25316d',
                  whiteSpace: 'nowrap', 
                  padding: { xs: '12px 8px', sm: '16px' }, 
                  fontSize: { xs: '0.8rem', sm: '0.875rem' } 
                }}>
                  Process ID
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 700, 
                  color: '#25316d',
                  whiteSpace: 'nowrap', 
                  padding: { xs: '12px 8px', sm: '16px' }, 
                  fontSize: { xs: '0.8rem', sm: '0.875rem' } 
                }}>
                  Burst Time
                </TableCell>
                {showArrivalTime && (
                  <TableCell sx={{ 
                    fontWeight: 700, 
                    color: '#25316d',
                    whiteSpace: 'nowrap', 
                    padding: { xs: '12px 8px', sm: '16px' }, 
                    fontSize: { xs: '0.8rem', sm: '0.875rem' } 
                  }}>
                    Arrival Time
                  </TableCell>
                )}
                {showPriority && (
                  <TableCell sx={{ 
                    fontWeight: 700, 
                    color: '#25316d',
                    whiteSpace: 'nowrap', 
                    padding: { xs: '12px 8px', sm: '16px' }, 
                    fontSize: { xs: '0.8rem', sm: '0.875rem' } 
                  }}>
                    Priority
                  </TableCell>
                )}
                {showCompletionTime && (
                  <TableCell sx={{ 
                    fontWeight: 700, 
                    color: '#25316d',
                    whiteSpace: 'nowrap', 
                    padding: { xs: '12px 8px', sm: '16px' }, 
                    fontSize: { xs: '0.8rem', sm: '0.875rem' } 
                  }}>
                    Completion Time
                  </TableCell>
                )}
                <TableCell sx={{ 
                  fontWeight: 700, 
                  color: '#25316d',
                  whiteSpace: 'nowrap', 
                  padding: { xs: '12px 8px', sm: '16px' }, 
                  fontSize: { xs: '0.8rem', sm: '0.875rem' } 
                }}>
                  Waiting Time
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 700, 
                  color: '#25316d',
                  whiteSpace: 'nowrap', 
                  padding: { xs: '12px 8px', sm: '16px' }, 
                  fontSize: { xs: '0.8rem', sm: '0.875rem' } 
                }}>
                  Turnaround Time
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((result, index) => (
                <TableRow 
                  key={result.process_id}
                  sx={{ 
                    '&:nth-of-type(odd)': { 
                      bgcolor: '#FAFBFC'
                    },
                    '&:hover': {
                      bgcolor: '#F0F3FB'
                    },
                    transition: 'background-color 0.2s',
                  }}
                >
                  <TableCell sx={{ 
                    fontWeight: 600,
                    color: '#1E1B4B',
                    padding: { xs: '12px 8px', sm: '16px' },
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  }}>
                    {result.process_id}
                  </TableCell>
                  <TableCell sx={{ 
                    padding: { xs: '12px 8px', sm: '16px' }, 
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    color: '#374151',
                    fontWeight: 500,
                  }}>
                    {result.burst_time}
                  </TableCell>
                  {showArrivalTime && (
                    <TableCell sx={{ 
                      padding: { xs: '12px 8px', sm: '16px' }, 
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      color: '#374151',
                      fontWeight: 500,
                    }}>
                      {result.arrival_time !== undefined ? result.arrival_time : 'N/A'}
                    </TableCell>
                  )}
                  {showPriority && (
                    <TableCell sx={{ 
                      padding: { xs: '12px 8px', sm: '16px' }, 
                      fontSize: { xs: '0.8rem', sm: '0.875rem' } 
                    }}>
                      {result.priority !== undefined ? (
                        <Chip 
                          label={result.priority} 
                          size="small" 
                          sx={{ 
                            fontWeight: 'bold',
                            bgcolor: 'rgba(156, 39, 176, 0.1)',
                            color: '#9c27b0',
                            height: { xs: '20px', sm: '24px' },
                            fontSize: { xs: '0.7rem', sm: '0.75rem' },
                          }} 
                        />
                      ) : 'N/A'}
                    </TableCell>
                  )}
                  {showCompletionTime && (
                    <TableCell sx={{ 
                      padding: { xs: '12px 8px', sm: '16px' }, 
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      color: '#374151',
                      fontWeight: 500,
                    }}>
                      {result.completion_time}
                    </TableCell>
                  )}
                  <TableCell sx={{ 
                    fontWeight: result.waiting_time === Math.min(...results.map(r => r.waiting_time)) ? 'bold' : 500,
                    color: result.waiting_time === Math.min(...results.map(r => r.waiting_time)) ? '#16a34a' : 
                           result.waiting_time === Math.max(...results.map(r => r.waiting_time)) ? '#dc2626' : '#374151',
                    padding: { xs: '12px 8px', sm: '16px' },
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  }}>
                    {result.waiting_time}
                  </TableCell>
                  <TableCell sx={{ 
                    fontWeight: result.turnaround_time === Math.min(...results.map(r => r.turnaround_time)) ? 'bold' : 500,
                    color: result.turnaround_time === Math.min(...results.map(r => r.turnaround_time)) ? '#16a34a' : 
                           result.turnaround_time === Math.max(...results.map(r => r.turnaround_time)) ? '#dc2626' : '#374151',
                    padding: { xs: '12px 8px', sm: '16px' },
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  }}>
                    {result.turnaround_time}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default ResultsTable; 