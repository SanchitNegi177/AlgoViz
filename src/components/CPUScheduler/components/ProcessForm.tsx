import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Process } from '../services/api';
import { useLocation } from 'react-router-dom';

interface ProcessFormProps {
  processes: Process[];
  setProcesses: React.Dispatch<React.SetStateAction<Process[]>>;
  timeQuantum: number;
  setTimeQuantum: React.Dispatch<React.SetStateAction<number>>;
  selectedAlgorithm: string;
  setSelectedAlgorithm: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: () => void;
}

const ProcessForm: React.FC<ProcessFormProps> = ({
  processes,
  setProcesses,
  timeQuantum,
  setTimeQuantum,
  selectedAlgorithm,
  setSelectedAlgorithm,
  onSubmit,
}) => {
  const [newProcess, setNewProcess] = useState<Process>({
    process_id: '',
    burst_time: 0,
    arrival_time: 0,
    ...(selectedAlgorithm === 'priority' || selectedAlgorithm === 'priority-preemptive' ? { priority: 0 } : {})
  });
  const [error, setError] = useState<string>('');
  const location = useLocation();
  
  // Check if we're on the algorithm detail page or compare page
  const isAlgorithmDetailPage = location.pathname.includes('/algorithm/');
  const isComparePage = location.pathname.includes('/compare');
  const showAlgorithmSelector = !isAlgorithmDetailPage || isComparePage;

  // Update newProcess when algorithm changes
  React.useEffect(() => {
    setNewProcess(prevProcess => {
      if (selectedAlgorithm === 'priority' || selectedAlgorithm === 'priority-preemptive') {
        return { ...prevProcess, priority: prevProcess.priority || 0 };
      } else {
        const { priority, ...rest } = prevProcess as any;
        return rest;
      }
    });
  }, [selectedAlgorithm]);

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
    
    // Add the new process - only include priority for priority algorithm
    let processToAdd: Process;
    if (selectedAlgorithm === 'priority' || selectedAlgorithm === 'priority-preemptive') {
      processToAdd = { ...newProcess, priority: newProcess.priority || 0 };
    } else {
      // For non-priority algorithms, don't include the priority field
      const { priority, ...rest } = newProcess as any;
      processToAdd = rest;
    }
    
    setProcesses([...processes, processToAdd]);
    
    // Reset form
    setNewProcess({
      process_id: '',
      burst_time: 0,
      arrival_time: 0,
      ...(selectedAlgorithm === 'priority' || selectedAlgorithm === 'priority-preemptive' ? { priority: 0 } : {})
    });
    setError('');
  };

  const handleDeleteProcess = (index: number) => {
    const updatedProcesses = [...processes];
    updatedProcesses.splice(index, 1);
    setProcesses(updatedProcesses);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (processes.length === 0) {
      setError('Please add at least one process');
      return;
    }
    
    if (selectedAlgorithm === 'round-robin' && timeQuantum <= 0) {
      setError('Time quantum must be greater than 0');
      return;
    }
    
    setError('');
    onSubmit();
  };

  const handleGenerateRandomProcesses = () => {
    const randomProcesses: Process[] = [];
    const count = Math.floor(Math.random() * 5) + 3; // Generate 3-7 processes
    const isPriorityAlgorithm = selectedAlgorithm === 'priority' || selectedAlgorithm === 'priority-preemptive';
    
    for (let i = 0; i < count; i++) {
      const process: Process = {
        process_id: `P${i+1}`,
        burst_time: Math.floor(Math.random() * 10) + 1, // 1-10
        arrival_time: Math.floor(Math.random() * 5), // 0-4
      };
      
      // Only add priority field for priority algorithm
      if (isPriorityAlgorithm) {
        process.priority = Math.floor(Math.random() * 5) + 1; // 1-5
      }
      
      randomProcesses.push(process);
    }
    
    setProcesses(randomProcesses);
  };

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Process Configuration
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          {showAlgorithmSelector && (
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="algorithm-select-label">Algorithm</InputLabel>
                <Select
                  labelId="algorithm-select-label"
                  id="algorithm-select"
                  value={selectedAlgorithm}
                  label="Algorithm"
                  onChange={handleAlgorithmChange}
                >
                  <MenuItem value="fcfs">First Come First Serve (FCFS)</MenuItem>
                  <MenuItem value="sjf">Shortest Job First (SJF)</MenuItem>
                  <MenuItem value="srtf">Shortest Remaining Time First (SRTF)</MenuItem>
                  <MenuItem value="priority">Priority Scheduling</MenuItem>
                  <MenuItem value="priority-preemptive">Priority Scheduling (Preemptive)</MenuItem>
                  <MenuItem value="round-robin">Round Robin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          )}
          
          {selectedAlgorithm === 'round-robin' && (
            <Grid item xs={12} sm={showAlgorithmSelector ? 4 : 6}>
              <TextField
                fullWidth
                label="Time Quantum"
                type="number"
                value={timeQuantum}
                onChange={(e) => setTimeQuantum(Number(e.target.value))}
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
          )}
          
          <Grid item xs={12} sm={showAlgorithmSelector ? 4 : 6}>
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={handleGenerateRandomProcesses}
              fullWidth
            >
              Generate Random Processes
            </Button>
          </Grid>
        </Grid>
        
        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
          Add New Process
        </Typography>
        
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12} sm={(selectedAlgorithm === 'priority' || selectedAlgorithm === 'priority-preemptive') ? 2 : 3}>
            <TextField
              fullWidth
              label="Process ID"
              name="process_id"
              value={newProcess.process_id}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={(selectedAlgorithm === 'priority' || selectedAlgorithm === 'priority-preemptive') ? 2 : 3}>
            <TextField
              fullWidth
              label="Burst Time"
              name="burst_time"
              type="number"
              value={newProcess.burst_time}
              onChange={handleChange}
              InputProps={{ inputProps: { min: 1 } }}
            />
          </Grid>
          <Grid item xs={12} sm={(selectedAlgorithm === 'priority' || selectedAlgorithm === 'priority-preemptive') ? 2 : 3}>
            <TextField
              fullWidth
              label="Arrival Time"
              name="arrival_time"
              type="number"
              value={newProcess.arrival_time}
              onChange={handleChange}
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>
          {(selectedAlgorithm === 'priority' || selectedAlgorithm === 'priority-preemptive') && (
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                label="Priority"
                name="priority"
                type="number"
                value={newProcess.priority || 0}
                onChange={handleChange}
                InputProps={{ inputProps: { min: 1 } }}
                helperText="Lower = Higher priority"
              />
            </Grid>
          )}
          <Grid item xs={12} sm={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddProcess}
              startIcon={<AddIcon />}
              fullWidth
            >
              Add Process
            </Button>
          </Grid>
        </Grid>
        
        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        
        {processes.length > 0 && (
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Process ID</TableCell>
                  <TableCell>Burst Time</TableCell>
                  <TableCell>Arrival Time</TableCell>
                  {(selectedAlgorithm === 'priority' || selectedAlgorithm === 'priority-preemptive') && <TableCell>Priority</TableCell>}
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {processes.map((process, index) => (
                  <TableRow key={process.process_id}>
                    <TableCell>{process.process_id}</TableCell>
                    <TableCell>{process.burst_time}</TableCell>
                    <TableCell>{process.arrival_time}</TableCell>
                    {(selectedAlgorithm === 'priority' || selectedAlgorithm === 'priority-preemptive') && <TableCell>{process.priority}</TableCell>}
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleDeleteProcess(index)}
                        sx={{ 
                          fontSize: '0.8rem',
                          px: 2,
                          py: 0.5,
                          minWidth: 'auto'
                        }}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={processes.length === 0}
          >
            Calculate
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default ProcessForm; 