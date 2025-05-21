import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import { AlgorithmResult } from '../services/SimpleApi';
import GanttChart from './GanttChart';
import ResultsTable from './ResultsTable';

interface SimpleResultsDisplayProps {
  result: AlgorithmResult | null;
  algorithm?: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const SimpleResultsDisplay: React.FC<SimpleResultsDisplayProps> = ({ result, algorithm = 'fcfs' }) => {
  const [tabValue, setTabValue] = useState(0);

  // Set tabValue to 0 (Gantt Chart) when new results are received
  useEffect(() => {
    if (result) {
      setTabValue(0); // Focus on the Gantt Chart tab when new results arrive
    }
  }, [result]);

  if (!result) {
    return null;
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Calculate additional statistics
  const totalBurstTime = result.results.reduce((sum, proc) => sum + proc.burst_time, 0);
  const cpuUtilization = Math.min(100, (totalBurstTime / result.gantt_data[result.gantt_data.length - 1].end_time) * 100);
  
  // Find the process with minimum and maximum waiting times
  const minWaitingTime = Math.min(...result.results.map(p => p.waiting_time));
  const maxWaitingTime = Math.max(...result.results.map(p => p.waiting_time));
  const minWaitingProcess = result.results.find(p => p.waiting_time === minWaitingTime)?.process_id;
  const maxWaitingProcess = result.results.find(p => p.waiting_time === maxWaitingTime)?.process_id;

  return (
    <Paper 
      sx={{ 
        p: { xs: 2, sm: 3.5 }, 
        mb: 4, 
        boxShadow: '0 10px 30px rgba(47, 75, 191, 0.1)',
        borderRadius: '16px',
        overflow: { xs: 'hidden', sm: 'visible' }, // Prevent overflow on mobile
        border: '1px solid rgba(159, 174, 240, 0.2)',
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ 
        fontWeight: 600, 
        color: '#1D3080',
        pb: 1.5,
        borderBottom: '1px solid rgba(159, 174, 240, 0.3)',
        mb: 3,
        fontSize: { xs: '1.25rem', sm: '1.5rem' }, // Smaller font on mobile
      }}>
        Scheduling Results
      </Typography>

      {/* Summary Statistics Cards */}
      <Grid container spacing={2} sx={{ mt: 1, mb: 4 }}>
        <Grid item xs={6} sm={6} md={3}>
          <Card sx={{ 
            height: '100%', 
            boxShadow: '0 6px 20px rgba(47, 75, 191, 0.08)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            border: '1px solid rgba(159, 174, 240, 0.2)',
            '&:hover': {
              boxShadow: '0 10px 25px rgba(47, 75, 191, 0.15)',
              transform: 'translateY(-5px)',
            },
          }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 2.5 } }}>
              <Typography variant="subtitle2" color="#435180" gutterBottom sx={{ fontWeight: 500, fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                Average Waiting Time
              </Typography>
              <Typography variant="h4" sx={{ mt: 1, color: '#2F4BBF', fontWeight: 600, fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
                {result.avg_waiting_time.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <Card sx={{ 
            height: '100%',
            boxShadow: '0 6px 20px rgba(47, 75, 191, 0.08)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            border: '1px solid rgba(159, 174, 240, 0.2)',
            '&:hover': {
              boxShadow: '0 10px 25px rgba(47, 75, 191, 0.15)',
              transform: 'translateY(-5px)',
            },
          }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 2.5 } }}>
              <Typography variant="subtitle2" color="#435180" gutterBottom sx={{ fontWeight: 500, fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                Average Turnaround Time
              </Typography>
              <Typography variant="h4" sx={{ mt: 1, color: '#5A7CFF', fontWeight: 600, fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
                {result.avg_turnaround_time.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <Card sx={{ 
            height: '100%',
            boxShadow: '0 6px 20px rgba(47, 75, 191, 0.08)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            border: '1px solid rgba(159, 174, 240, 0.2)',
            '&:hover': {
              boxShadow: '0 10px 25px rgba(47, 75, 191, 0.15)',
              transform: 'translateY(-5px)',
            },
          }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 2.5 } }}>
              <Typography variant="subtitle2" color="#435180" gutterBottom sx={{ fontWeight: 500, fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                Total Processes
              </Typography>
              <Typography variant="h4" sx={{ mt: 1, color: '#9FAEF0', fontWeight: 600, fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
                {result.results.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <Card sx={{ 
            height: '100%',
            boxShadow: '0 6px 20px rgba(47, 75, 191, 0.08)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            border: '1px solid rgba(159, 174, 240, 0.2)',
            '&:hover': {
              boxShadow: '0 10px 25px rgba(47, 75, 191, 0.15)',
              transform: 'translateY(-5px)',
            },
          }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 2.5 } }}>
              <Typography variant="subtitle2" color="#435180" gutterBottom sx={{ fontWeight: 500, fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                CPU Utilization
              </Typography>
              <Typography variant="h4" sx={{ mt: 1, color: '#65D587', fontWeight: 600, fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
                {cpuUtilization.toFixed(1)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Waiting Time Insights */}
      <Paper 
        elevation={0}
        sx={{ 
          p: { xs: 1.5, sm: 2.5 }, 
          mb: 4, 
          bgcolor: '#EDF1FF',
          borderRadius: '12px',
          border: '1px solid rgba(159, 174, 240, 0.3)',
        }}
      >
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: '#1D3080', mb: 2, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
          Waiting Time Insights
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, flexWrap: 'wrap', gap: { xs: 2, sm: 3 } }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5,
            bgcolor: 'white',
            px: { xs: 1.5, sm: 2.5 },
            py: 1.5,
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(47, 75, 191, 0.08)',
            border: '1px solid rgba(159, 174, 240, 0.2)',
            width: { xs: '100%', sm: 'auto' }, // Full width on mobile
          }}>
            <Typography variant="body2" color="#435180" sx={{ fontWeight: 500, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
              Min Waiting Time:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600, color: '#1F2A4B', fontSize: { xs: '0.85rem', sm: '1rem' } }}>
              {minWaitingTime} (Process {minWaitingProcess})
            </Typography>
          </Box>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5,
            bgcolor: 'white',
            px: { xs: 1.5, sm: 2.5 },
            py: 1.5,
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(47, 75, 191, 0.08)',
            border: '1px solid rgba(159, 174, 240, 0.2)',
            width: { xs: '100%', sm: 'auto' }, // Full width on mobile
          }}>
            <Typography variant="body2" color="#435180" sx={{ fontWeight: 500, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
              Max Waiting Time:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600, color: '#1F2A4B', fontSize: { xs: '0.85rem', sm: '1rem' } }}>
              {maxWaitingTime} (Process {maxWaitingProcess})
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Tabs for different visualizations */}
      <Box sx={{ 
        borderBottom: 1, 
        borderColor: 'rgba(159, 174, 240, 0.3)',
        mt: 4,
      }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="fullWidth"
          TabIndicatorProps={{
            style: {
              backgroundColor: '#2F4BBF',
              height: 3
            }
          }}
          sx={{
            '& .MuiTab-root': {
              fontWeight: 500,
              fontSize: { xs: '0.8rem', sm: '0.95rem' },
              transition: 'all 0.2s',
              padding: { xs: '8px 0', sm: '12px 16px' },
              '&:hover': {
                backgroundColor: 'rgba(159, 174, 240, 0.1)',
              },
            },
            '& .Mui-selected': {
              color: '#2F4BBF',
              fontWeight: 600,
            },
          }}
        >
          <Tab label="Animated Execution Timeline" />
          <Tab label="Process Statistics Table" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <GanttChart 
          data={result.gantt_data} 
          title="Gantt Chart Visualization" 
          algorithm={algorithm}
        />
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        <ResultsTable 
          results={result.results} 
          avgWaitingTime={result.avg_waiting_time} 
          avgTurnaroundTime={result.avg_turnaround_time} 
          title="Process Statistics" 
        />
      </TabPanel>
    </Paper>
  );
};

export default SimpleResultsDisplay; 