import React from 'react';
import { Box, Typography, Grid, Container } from '@mui/material';
import AlgorithmCard from '../components/AlgorithmCard.tsx';

const algorithmData = [
  {
    id: 'fcfs',
    title: 'FCFS',
    description: 'Processes are executed in the order they arrive in the ready queue. Simple but may not be optimal for different process priorities.',
    preemptive: false,
    strengths: ['Simple to implement', 'Fair for processes that arrive first', 'Low scheduling overhead'],
    weaknesses: ['Can lead to convoy effect', 'Long average waiting time', 'Not suitable for interactive systems'],
  },
  {
    id: 'sjf',
    title: 'SJF',
    description: 'Selects the process with the smallest execution time. Non-preemptive version waits for the current process to complete.',
    preemptive: false,
    strengths: ['Optimal average waiting time', 'Good for batch systems', 'Reduces average turnaround time'],
    weaknesses: ['Potential starvation of longer processes', 'Requires knowledge of burst time', 'Not suitable for interactive systems'],
  },
  {
    id: 'priority',
    title: 'Priority Scheduling',
    description: 'Processes are scheduled according to their priority, with higher priority processes being executed first.',
    preemptive: false,
    strengths: ['Prioritizes important processes', 'Flexible policy implementation', 'Good for real-time systems'],
    weaknesses: ['Can lead to starvation', 'Priority inversion problems', 'Need for aging mechanism'],
  },
  {
    id: 'round-robin',
    title: 'Round Robin',
    description: 'Each process is assigned a fixed time slot in a cyclic queue. Suitable for time-sharing systems.',
    preemptive: true,
    strengths: ['Fair allocation of CPU', 'No starvation', 'Good response time for short processes'],
    weaknesses: ['Higher average turnaround time', 'Performance depends on time quantum', 'Context switching overhead'],
  },
  {
    id: 'srtf',
    title: 'SRTF',
    description: 'Preemptive version of SJF. Selects the process with the smallest remaining time at every state change.',
    preemptive: true,
    strengths: ['Optimal average waiting time', 'Responsive to short processes', 'Good for interactive systems'],
    weaknesses: ['Overhead due to frequent context switching', 'Potential starvation of longer processes', 'Requires continuous monitoring'],
  },
  {
    id: 'priority-preemptive',
    title: 'Priority Scheduling',
    description: 'Preemptive version where higher priority processes can interrupt running processes.',
    preemptive: true,
    strengths: ['Better response time for high priority processes', 'Adaptive to changing system needs', 'Suitable for real-time systems'],
    weaknesses: ['Context switching overhead', 'Can lead to starvation', 'Implementation complexity'],
  }
];

const AlgorithmsPage = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          CPU Scheduling Algorithms
        </Typography>
        <Typography variant="body1" paragraph sx={{ mb: 3 }}>
          Choose an algorithm to visualize how it schedules processes on the CPU. Each algorithm has different 
          characteristics and is suitable for different scenarios.
        </Typography>
        
        <Grid container spacing={3}>
          {algorithmData.map((algorithm, index) => (
            <Grid item xs={12} sm={6} md={4} key={algorithm.id}>
              <AlgorithmCard
                id={algorithm.id}
                title={algorithm.title}
                description={algorithm.description}
                preemptive={algorithm.preemptive}
                parameters={algorithm.parameters}
                strengths={algorithm.strengths}
                weaknesses={algorithm.weaknesses}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default AlgorithmsPage; 