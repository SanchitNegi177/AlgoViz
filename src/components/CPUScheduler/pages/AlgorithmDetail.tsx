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
}

const algorithms: Record<string, AlgorithmInfo> = {
  fcfs: {
    id: 'fcfs',
    title: 'First Come First Serve (FCFS)',
    description: 'Processes are executed in the order they arrive in the ready queue. It is the simplest scheduling algorithm.',
    preemptive: false,
  },
  sjf: {
    id: 'sjf',
    title: 'Shortest Job First (SJF)',
    description: 'Processes are executed according to their burst time. The process with the smallest burst time is executed first.',
    preemptive: false,
  },
  srtf: {
    id: 'srtf',
    title: 'Shortest Remaining Time First (SRTF)',
    description: 'Preemptive version of SJF. The process with the smallest remaining time is executed first.',
    preemptive: true,
  },
  priority: {
    id: 'priority',
    title: 'Priority Scheduling (Non-preemptive)',
    description: 'Processes are executed according to their priority. Higher priority processes are executed first.',
    preemptive: false,
  },
  'priority-preemptive': {
    id: 'priority-preemptive',
    title: 'Priority Scheduling (Preemptive)',
    description: 'Higher priority processes can preempt (interrupt) lower priority running processes.',
    preemptive: true,
  },
  'round-robin': {
    id: 'round-robin',
    title: 'Round Robin',
    description: 'Each process is assigned a fixed time slice (quantum) in a cyclic way. It is designed for time-sharing systems.',
    preemptive: true,
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
        <Typography variant="h4" component="h1" gutterBottom>
          {algorithm.title}
        </Typography>
        <Typography variant="body1" paragraph>
          {algorithm.description}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Type: {algorithm.preemptive ? 'Preemptive' : 'Non-preemptive'}
        </Typography>
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