import React from 'react';
import { Typography, Grid, Paper, Box, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import AlgorithmCard from '../components/AlgorithmCard';

const algorithmData = [
  {
    id: 'fcfs',
    title: 'First Come First Serve (FCFS)',
    description: 'Processes are executed in the order they arrive in the ready queue. It is the simplest scheduling algorithm.',
    preemptive: false,
  },
  {
    id: 'sjf',
    title: 'Shortest Job First (SJF)',
    description: 'Processes are executed according to their burst time. The process with the smallest burst time is executed first.',
    preemptive: false,
  },
  {
    id: 'srtf',
    title: 'Shortest Remaining Time First (SRTF)',
    description: 'Preemptive version of SJF. The process with the smallest remaining time is executed first. If a new process arrives with a smaller burst time than the current process, the CPU is preempted.',
    preemptive: true,
  },
  {
    id: 'priority',
    title: 'Priority Scheduling',
    description: 'Processes are executed according to their priority. Higher priority processes are executed first. Priority can be determined by various factors.',
    preemptive: false,
  },
  {
    id: 'round-robin',
    title: 'Round Robin',
    description: 'Each process is assigned a fixed time slice (quantum) in a cyclic way. It is designed for time-sharing systems.',
    preemptive: true,
    parameters: {
      'Time Quantum': 'The time slice allocated to each process',
    },
  },
];

const Home: React.FC = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Paper
        sx={{
          py: 6,
          px: 4,
          mb: 4,
          background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
          color: 'white',
          borderRadius: 2,
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          CPU Scheduling Algorithm Visualization
        </Typography>
        <Typography variant="h6" paragraph>
          Understand how different CPU scheduling algorithms work with interactive visualizations
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          component={RouterLink}
          to="/compare"
          startIcon={<CompareArrowsIcon />}
          sx={{ mt: 2 }}
        >
          Compare All Algorithms
        </Button>
      </Paper>

      {/* About Section */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          About CPU Scheduling
        </Typography>
        <Typography variant="body1" paragraph>
          CPU scheduling is the process of determining which process in the ready queue will be 
          allocated the CPU for execution. The main objective of CPU scheduling is to maximize 
          CPU utilization, throughput, and efficiency while minimizing response time, waiting time, 
          and turnaround time.
        </Typography>
        <Typography variant="body1" paragraph>
          There are various CPU scheduling algorithms, each with its advantages and disadvantages. 
          This application helps you visualize how these algorithms work with your own set of processes.
        </Typography>
      </Paper>

      {/* Algorithms Section */}
      <Typography variant="h5" gutterBottom>
        Available Algorithms
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {algorithmData.map((algorithm) => (
          <Grid item xs={12} sm={6} md={4} key={algorithm.id}>
            <AlgorithmCard {...algorithm} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Home;
