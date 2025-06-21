import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Button,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Process, AlgorithmResult, api } from '../services/SimpleApi.ts';
import ProcessForm from '../components/ProcessForm.tsx';
import GanttChart from '../components/GanttChart.tsx';
import ResultsTable from '../components/ResultsTable.tsx';

interface AlgorithmInfo {
  id: string;
  title: string;
  description: string;
  preemptive: boolean;
  briefInfo: string;
}

const algorithms: Record<string, AlgorithmInfo> = {
  fcfs: {
    id: 'fcfs',
    title: 'First Come First Serve (FCFS)',
    description: 'Processes are executed in the order they arrive in the ready queue. It is the simplest scheduling algorithm.',
    preemptive: false,
    briefInfo: 'FCFS is non-preemptive, meaning once a process starts execution, it continues until it completes. This can lead to the "convoy effect" where short processes wait behind long ones.',
  },
  sjf: {
    id: 'sjf',
    title: 'Shortest Job First (SJF)',
    description: 'Non-preemptive algorithm where CPU is allocated to the process with the smallest burst time.',
    preemptive: false,
    briefInfo: 'SJF provides optimal average waiting time but can lead to starvation of longer processes. It requires prior knowledge of CPU burst time.',
  },
  srtf: {
    id: 'srtf',
    title: 'Shortest Remaining Time First (SRTF)',
    description: 'Preemptive version of SJF. The process with the smallest remaining time is executed first.',
    preemptive: true,
    briefInfo: 'SRTF is preemptive, allowing shorter processes to interrupt longer ones. It provides optimal average waiting time but may cause frequent context switches.',
  },
  priority: {
    id: 'priority',
    title: 'Priority Scheduling (Non-preemptive)',
    description: 'Processes are scheduled based on priority, with higher priority processes executed first.',
    preemptive: false,
    briefInfo: 'Priority scheduling can lead to starvation of low-priority processes. Aging mechanisms can be used to prevent indefinite blocking.',
  },
  'priority-preemptive': {
    id: 'priority-preemptive',
    title: 'Priority Scheduling (Preemptive)',
    description: 'Higher priority processes can preempt (interrupt) lower priority running processes.',
    preemptive: true,
    briefInfo: 'Preemptive priority scheduling allows high-priority processes to interrupt running processes, providing better response time for critical tasks.',
  },
  'round-robin': {
    id: 'round-robin',
    title: 'Round Robin',
    description: 'Each process is assigned a fixed time slice (quantum) in a cyclic way. It is designed for time-sharing systems.',
    preemptive: true,
    briefInfo: 'Round Robin ensures fair CPU allocation and prevents starvation. Performance depends on time quantum size - too small causes overhead, too large reduces responsiveness.',
  },
};

const AlgorithmDetail: React.FC = () => {
  const { algorithmId } = useParams<{ algorithmId: string }>();
  const navigate = useNavigate();

  const [processes, setProcesses] = useState<Process[]>([]);
  const [timeQuantum, setTimeQuantum] = useState<number>(2);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('');
  const [result, setResult] = useState<AlgorithmResult | null>(null);
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Set the selected algorithm based on the URL parameter
  useEffect(() => {
    if (algorithmId && algorithms[algorithmId]) {
      setSelectedAlgorithm(algorithmId);
    } else {
      navigate('/cpu-scheduler/algorithms');
    }
  }, [algorithmId, navigate]);

  // Check if the algorithm exists
  if (!algorithmId || !algorithms[algorithmId]) {
    return null; // The navigate in useEffect will handle redirecting
  }

  const algorithm = algorithms[algorithmId];

  const calculateScheduling = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let result: AlgorithmResult;
      
      // Call the calculate function from the API
      result = await api.calculate(algorithmId!, processes, algorithmId === 'round-robin' ? timeQuantum : undefined);
      
      setResult(result);
    } catch (err) {
      console.error('Error calculating scheduling:', err);
      setError('Failed to calculate scheduling. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate('/cpu-scheduler/algorithms')}
        sx={{ mb: 2 }}
      >
        Back to Algorithms
      </Button>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        {/* Title with inline tag */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1">
            {algorithm.title}
          </Typography>
          <Box
            component="span"
            sx={{
              display: 'inline-block',
              px: 2,
              py: 0.5,
              borderRadius: '16px',
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              backgroundColor: algorithm.preemptive ? '#6366F1' : '#3B82F6',
              color: 'white',
              boxShadow: algorithm.preemptive 
                ? '0 2px 8px rgba(99, 102, 241, 0.3)' 
                : '0 2px 8px rgba(59, 130, 246, 0.3)',
              whiteSpace: 'nowrap',
            }}
          >
            {algorithm.preemptive ? 'Preemptive Algorithm' : 'Non-preemptive Algorithm'}
          </Box>
        </Box>
        
        <Typography variant="body1" paragraph>
          {algorithm.description}
        </Typography>
        
        {/* Brief Information */}
        <Box
          sx={{
            p: 2,
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            borderLeft: '4px solid #6c757d',
            fontStyle: 'italic',
            color: '#495057',
            lineHeight: 1.6,
          }}
        >
          <Typography variant="body2">
            {algorithm.briefInfo}
          </Typography>
        </Box>
      </Paper>
      
      <ProcessForm
        processes={processes}
        setProcesses={setProcesses}
        timeQuantum={timeQuantum}
        setTimeQuantum={setTimeQuantum}
        selectedAlgorithm={selectedAlgorithm}
        setSelectedAlgorithm={setSelectedAlgorithm}
        onSubmit={calculateScheduling}
      />
      
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      )}
      
      {result && (
        <Box>
          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Results
          </Typography>
          
          <GanttChart data={result.gantt_data} title="Gantt Chart" />
          
          <ResultsTable
            results={result.results}
            avgWaitingTime={result.avg_waiting_time}
            avgTurnaroundTime={result.avg_turnaround_time}
            title="Process Details"
          />
        </Box>
      )}
    </Box>
  );
};

export default AlgorithmDetail; 