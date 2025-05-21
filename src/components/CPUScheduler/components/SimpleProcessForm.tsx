import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  CircularProgress,
  Alert,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import { Process, AlgorithmResult, api } from '../services/SimpleApi';
import SimpleResultsDisplay from './SimpleResultsDisplay';

// Algorithm information data
const algorithmInfo = {
  fcfs: {
    name: 'First Come First Serve (FCFS)',
    description: 'Processes are executed in the order they arrive in the ready queue. This is the simplest scheduling algorithm.',
    details: 'FCFS is non-preemptive, meaning once a process starts execution, it continues until it completes. This can lead to the "convoy effect" where short processes wait behind long ones.',
    preemptive: false,
  },
  sjf: {
    name: 'Shortest Job First (SJF)',
    description: 'Non-preemptive algorithm where CPU is allocated to the process with the smallest burst time.',
    details: 'SJF provides optimal average waiting time but can lead to starvation of longer processes. It requires prior knowledge of CPU burst time.',
    preemptive: false,
  },
  srtf: {
    name: 'Shortest Remaining Time First (SRTF)',
    description: 'Preemptive version of SJF where CPU is allocated to the process with the smallest remaining time.',
    details: 'SRTF preempts the current process if a new process arrives with a smaller remaining time. This can lead to better average waiting time but more context switches.',
    preemptive: true,
  },
  priority: {
    name: 'Priority Scheduling (Non-preemptive)',
    description: 'Processes are scheduled based on priority, with higher priority processes executed first.',
    details: 'Priority scheduling can lead to starvation of low-priority processes. Aging mechanisms can be used to prevent indefinite blocking.',
    preemptive: false,
  },
  'priority-preemptive': {
    name: 'Priority Scheduling (Preemptive)',
    description: 'Higher priority processes can preempt (interrupt) lower priority processes.',
    details: 'Preemptive priority scheduling is more responsive to high priority tasks but may lead to more context switches.',
    preemptive: true,
  },
  'round-robin': {
    name: 'Round Robin',
    description: 'Each process is assigned a fixed time slice in a cyclic manner, ideal for time-sharing systems.',
    details: 'The time quantum is critical for performance. Too large and it becomes FCFS, too small and there is excessive context switching overhead.',
    preemptive: true,
  }
};

// Define the props interface
interface SimpleProcessFormProps {
  onProcessesChange?: (processes: Process[]) => void;
  onTimeQuantumChange?: (timeQuantum: number) => void;
  hideAlgorithmSelector?: boolean;
}

const SimpleProcessForm: React.FC<SimpleProcessFormProps> = ({ 
  onProcessesChange, 
  onTimeQuantumChange,
  hideAlgorithmSelector = false
}) => {
  const { algorithmId } = useParams<{ algorithmId: string }>();
  const [processes, setProcesses] = useState<Process[]>([]);
  const [timeQuantum, setTimeQuantum] = useState<number>(2);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('fcfs');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<AlgorithmResult | null>(null);
  
  const [newProcess, setNewProcess] = useState<Process>({
    process_id: '',
    burst_time: 0,
    arrival_time: 0,
    ...(selectedAlgorithm === 'priority' || selectedAlgorithm === 'priority-preemptive' ? { priority: 0 } : {})
  });

  // Set the selected algorithm based on URL param if available
  useEffect(() => {
    if (algorithmId && ['fcfs', 'sjf', 'srtf', 'priority', 'priority-preemptive', 'round-robin'].includes(algorithmId)) {
      setSelectedAlgorithm(algorithmId);
      // Update newProcess state when algorithm changes to include/exclude priority field
      setNewProcess(prevProcess => {
        if (algorithmId === 'priority' || algorithmId === 'priority-preemptive') {
          return { ...prevProcess, priority: prevProcess.priority || 0 };
        } else {
          const { priority, ...rest } = prevProcess as any;
          return rest;
        }
      });
    }
  }, [algorithmId]);

  // Update newProcess when algorithm changes
  useEffect(() => {
    setNewProcess(prevProcess => {
      if (selectedAlgorithm === 'priority' || selectedAlgorithm === 'priority-preemptive') {
        return { ...prevProcess, priority: prevProcess.priority || 0 };
      } else {
        const { priority, ...rest } = prevProcess as any;
        return rest;
      }
    });
  }, [selectedAlgorithm]);

  // Notify parent component when processes change
  useEffect(() => {
    if (onProcessesChange) {
      onProcessesChange(processes);
    }
  }, [processes, onProcessesChange]);

  // Notify parent component when time quantum changes
  useEffect(() => {
    if (onTimeQuantumChange) {
      onTimeQuantumChange(timeQuantum);
    }
  }, [timeQuantum, onTimeQuantumChange]);

  const handleAlgorithmChange = (event: SelectChangeEvent) => {
    setSelectedAlgorithm(event.target.value);
  };

  const handleAddProcess = () => {
    // Validate process fields
    if (!newProcess.process_id) {
      setError('Process ID is required');
      return;
    }
    
    if (newProcess.burst_time <= 0) {
      setError('Burst time must be greater than 0');
      return;
    }
    
    // Check for duplicate process IDs
    if (processes.some(p => p.process_id === newProcess.process_id)) {
      setError('Process ID must be unique');
      return;
    }
    
    // Add the new process - only include priority for priority algorithms
    let processToAdd: Process;
    if (selectedAlgorithm === 'priority' || selectedAlgorithm === 'priority-preemptive') {
      processToAdd = { ...newProcess, priority: newProcess.priority || 0 };
    } else {
      // For non-priority algorithms, don't include the priority field
      const { priority, ...rest } = newProcess as any;
      processToAdd = rest;
    }
    
    const updatedProcesses = [...processes, processToAdd];
    setProcesses(updatedProcesses);
    
    // Reset form
    setNewProcess({
      process_id: '',
      burst_time: 0,
      arrival_time: 0,
      ...(selectedAlgorithm === 'priority' || selectedAlgorithm === 'priority-preemptive' ? { priority: 0 } : {})
    });
    setError('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // For numeric fields, convert to number
    if (name === 'burst_time' || name === 'arrival_time' || name === 'priority') {
      setNewProcess({ ...newProcess, [name]: Number(value) });
    } else {
      setNewProcess({ ...newProcess, [name]: value });
    }
  };

  const handleRemoveProcess = (processId: string) => {
    setProcesses(processes.filter(p => p.process_id !== processId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (processes.length === 0) {
      setError('Please add at least one process');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const resultData = await api.calculate(selectedAlgorithm, processes, timeQuantum);
      setResult(resultData);
    } catch (err) {
      console.error('Error calculating:', err);
      setError('Failed to calculate. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleTimeQuantumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value > 0) {
      setTimeQuantum(value);
    }
  };

  const handleGenerateRandomProcesses = () => {
    const randomProcesses: Process[] = [];
    const count = 5; // Generate 5 processes
    const isPriorityAlgorithm = selectedAlgorithm === 'priority' || selectedAlgorithm === 'priority-preemptive';
    
    for (let i = 0; i < count; i++) {
      const process: Process = {
        process_id: `P${i+1}`,
        burst_time: Math.floor(Math.random() * 10) + 1, // 1-10
        arrival_time: Math.floor(Math.random() * 5), // 0-4
      };
      
      // Only add priority field for priority algorithms
      if (isPriorityAlgorithm) {
        process.priority = Math.floor(Math.random() * 5) + 1; // 1-5
      }
      
      randomProcesses.push(process);
    }
    
    setProcesses(randomProcesses);
  };

  const currentAlgoInfo = algorithmInfo[selectedAlgorithm as keyof typeof algorithmInfo];

  return (
    <Box>
      {/* Algorithm Information Card */}
      {!hideAlgorithmSelector && (
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'flex-start', gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" component="h2" sx={{ mb: 1, fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
                  {currentAlgoInfo.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                  {currentAlgoInfo.description}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />
            
            <Typography variant="body2" paragraph sx={{ fontStyle: 'italic', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
              {currentAlgoInfo.details}
            </Typography>
            
            <Box 
              sx={{ 
                display: 'inline-block', 
                px: 1.5, 
                py: 0.5, 
                bgcolor: currentAlgoInfo.preemptive ? '#bbdefb' : '#c8e6c9',
                borderRadius: 1,
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                {currentAlgoInfo.preemptive ? 'Preemptive' : 'Non-preemptive'} Algorithm
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
          Process Configuration
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
            {!algorithmId && !hideAlgorithmSelector && (
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Algorithm</InputLabel>
                  <Select
                    value={selectedAlgorithm}
                    label="Algorithm"
                    onChange={handleAlgorithmChange}
                    sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                  >
                    <MenuItem value="fcfs">First Come First Serve (FCFS)</MenuItem>
                    <MenuItem value="sjf">Shortest Job First (SJF)</MenuItem>
                    <MenuItem value="priority">Priority Scheduling (Non-preemptive)</MenuItem>
                    <MenuItem value="round-robin">Round Robin</MenuItem>
                    <MenuItem value="srtf">Shortest Remaining Time First (SRTF)</MenuItem>
                    <MenuItem value="priority-preemptive">Priority Scheduling (Preemptive)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}
            
            {selectedAlgorithm === 'round-robin' && (
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Time Quantum"
                  type="number"
                  value={timeQuantum}
                  onChange={handleTimeQuantumChange}
                  inputProps={{ min: 1 }}
                  InputProps={{ 
                    sx: { fontSize: { xs: '0.9rem', sm: '1rem' } }
                  }}
                  InputLabelProps={{
                    sx: { fontSize: { xs: '0.9rem', sm: '1rem' } }
                  }}
                />
              </Grid>
            )}
            
            <Grid item xs={12} sm={4}>
              <Button 
                variant="outlined" 
                color="primary" 
                onClick={handleGenerateRandomProcesses}
                fullWidth
                sx={{ 
                  fontSize: { xs: '0.85rem', sm: '0.9rem' },
                  py: { xs: 1, sm: 1.5 }
                }}
              >
                Generate Random Processes
              </Button>
            </Grid>
          </Grid>
          
          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, fontSize: { xs: '1rem', sm: '1.1rem' } }}>
            Add New Process
          </Typography>
          
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                label="Process ID"
                name="process_id"
                value={newProcess.process_id}
                onChange={handleChange}
                InputProps={{ 
                  sx: { fontSize: { xs: '0.9rem', sm: '1rem' } }
                }}
                InputLabelProps={{
                  sx: { fontSize: { xs: '0.9rem', sm: '1rem' } }
                }}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                label="Burst Time"
                name="burst_time"
                type="number"
                value={newProcess.burst_time}
                onChange={handleChange}
                inputProps={{ min: 1 }}
                InputProps={{ 
                  sx: { fontSize: { xs: '0.9rem', sm: '1rem' } }
                }}
                InputLabelProps={{
                  sx: { fontSize: { xs: '0.9rem', sm: '1rem' } }
                }}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                label="Arrival Time"
                name="arrival_time"
                type="number"
                value={newProcess.arrival_time}
                onChange={handleChange}
                inputProps={{ min: 0 }}
                InputProps={{ 
                  sx: { fontSize: { xs: '0.9rem', sm: '1rem' } }
                }}
                InputLabelProps={{
                  sx: { fontSize: { xs: '0.9rem', sm: '1rem' } }
                }}
              />
            </Grid>
            {(selectedAlgorithm === 'priority' || selectedAlgorithm === 'priority-preemptive' || selectedAlgorithm === 'priority_preemptive') && (
              <Grid item xs={6} sm={3}>
                <TextField
                  fullWidth
                  label="Priority"
                  name="priority"
                  type="number"
                  value={newProcess.priority}
                  onChange={handleChange}
                  inputProps={{ min: 1 }}
                  helperText="Lower number = Higher priority"
                  InputProps={{ 
                    sx: { fontSize: { xs: '0.9rem', sm: '1rem' } }
                  }}
                  InputLabelProps={{
                    sx: { fontSize: { xs: '0.9rem', sm: '1rem' } }
                  }}
                  FormHelperTextProps={{
                    sx: { fontSize: { xs: '0.7rem', sm: '0.75rem' }, mt: 0.5 }
                  }}
                />
              </Grid>
            )}
            <Grid item xs={12} sm={(selectedAlgorithm === 'priority' || selectedAlgorithm === 'priority-preemptive' || selectedAlgorithm === 'priority_preemptive') ? 12 : 3}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddProcess}
                fullWidth
                sx={{ 
                  fontSize: { xs: '0.85rem', sm: '0.9rem' },
                  py: { xs: 1, sm: 1.5 },
                  mt: { xs: 1, sm: 0 }
                }}
              >
                Add Process
              </Button>
            </Grid>
          </Grid>
          
          {error && (
            <Alert severity="error" sx={{ mt: 2, fontSize: { xs: '0.85rem', sm: '0.9rem' } }}>
              {error}
            </Alert>
          )}
          
          {processes.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                Processes:
              </Typography>
              <Box sx={{ mt: 1, maxHeight: { xs: '200px', sm: 'none' }, overflowY: { xs: 'auto', sm: 'visible' } }}>
                {processes.map((process, index) => (
                  <Box 
                    key={index} 
                    sx={{ 
                      mb: 1, 
                      p: { xs: 1, sm: 1.5 }, 
                      display: 'flex', 
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      bgcolor: '#f5f5f5',
                      borderRadius: 1,
                      flexWrap: { xs: 'wrap', sm: 'nowrap' }, // Wrap on mobile
                    }}
                  >
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' }, mr: 1, flex: { xs: '1 0 100%', sm: 1 }, mb: { xs: 1, sm: 0 } }}>
                      <strong>Process {process.process_id}:</strong> Burst Time = {process.burst_time}, 
                      Arrival Time = {process.arrival_time}
                      {process.priority !== undefined && (selectedAlgorithm === 'priority' || selectedAlgorithm === 'priority-preemptive' || selectedAlgorithm === 'priority_preemptive') ? `, Priority = ${process.priority}` : ''}
                    </Typography>
                    <Button 
                      size="small" 
                      color="error" 
                      onClick={() => handleRemoveProcess(process.process_id)}
                      sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' }, ml: { xs: 'auto', sm: 0 } }}
                    >
                      Remove
                    </Button>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={processes.length === 0 || loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              sx={{ 
                fontSize: { xs: '0.9rem', sm: '1rem' },
                py: { xs: 1, sm: 1.5 }
              }}
            >
              {loading ? 'Calculating...' : 'Calculate'}
            </Button>
          </Box>
        </Box>
      </Paper>
      
      {result && <SimpleResultsDisplay result={result} algorithm={selectedAlgorithm} />}
    </Box>
  );
};

export default SimpleProcessForm; 