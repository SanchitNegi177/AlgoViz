import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Alert,
  CircularProgress,
  Tab,
  Tabs,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import TableChartIcon from '@mui/icons-material/TableChart';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Process, AlgorithmResult } from '../services/SimpleApi.ts';
import GanttChart from '../components/GanttChart.tsx';
import ResultsTable from '../components/ResultsTable.tsx';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer,
} from 'recharts';
import { compareAlgorithms } from '../utils/schedulingAlgorithms';

// Define the interface for the performance metrics chart data
interface PerformanceData {
  name: string;
  avg_waiting_time: number;
  avg_turnaround_time: number;
}

// Define the Compare Result interface
interface CompareResult {
  fcfs: AlgorithmResult;
  sjf: AlgorithmResult;
  srtf: AlgorithmResult;
  priority: AlgorithmResult;
  priority_preemptive?: AlgorithmResult;
  round_robin: AlgorithmResult;
  [key: string]: AlgorithmResult | undefined;
}

// Define the interface for algorithm-specific configuration
interface AlgorithmConfig {
  processes: Process[];
  timeQuantum?: number;
  enabled: boolean;
}

// Algorithm names mapping
const algorithmNames: Record<string, string> = {
  fcfs: 'First Come First Serve (FCFS)',
  sjf: 'Shortest Job First (SJF)',
  srtf: 'Shortest Remaining Time First (SRTF)',
  priority: 'Priority Scheduling',
  priority_preemptive: 'Priority Scheduling (Preemptive)',
  round_robin: 'Round Robin',
};

// Short algorithm names for charts
const shortAlgorithmNames: Record<string, string> = {
  fcfs: 'FCFS',
  sjf: 'SJF',
  srtf: 'SRTF',
  priority: 'Priority',
  priority_preemptive: 'Priority (P)',
  round_robin: 'Round Robin',
};

// Algorithm keys for selection
const algorithmKeys = ['fcfs', 'sjf', 'srtf', 'priority', 'priority_preemptive', 'round_robin'];

// First, let's create a custom priority input component
const PriorityInput: React.FC<{
  process: Process;
  onChange: (updatedProcess: Process) => void;
}> = ({ process, onChange }) => {
  const handlePriorityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    onChange({
      ...process,
      priority: value
    });
  };

  return (
    <TextField
      fullWidth
      required
      label="Priority"
      type="number"
      value={process.priority || 1}
      onChange={handlePriorityChange}
      inputProps={{ min: 1 }}
      helperText="Lower number = Higher priority"
      error={!process.priority}
      size="small"
      sx={{ mt: 1, mb: 1 }}
    />
  );
};

// Process component for the Compare tab
const ProcessConfigItem: React.FC<{
  process: Process;
  onUpdate: (updatedProcess: Process) => void;
  onRemove: (processId: string) => void;
  showPriority: boolean;
}> = ({ process, onUpdate, onRemove, showPriority }) => {
  const handleChange = (field: keyof Process) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = field === 'process_id' ? e.target.value : Number(e.target.value);
    onUpdate({
      ...process,
      [field]: value
    });
  };

  return (
    <Box sx={{ 
      p: 2, 
      mb: 2, 
      border: '1px solid #e0e0e0', 
      borderRadius: 1,
      backgroundColor: '#f9f9f9'
    }}>
      <Grid container spacing={{ xs: 1, sm: 2 }} alignItems="center">
        <Grid item xs={6} sm={3}>
          <TextField
            fullWidth
            required
            label="Process ID"
            value={process.process_id}
            onChange={handleChange('process_id')}
            error={!process.process_id}
            size="small"
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <TextField
            fullWidth
            required
            label="Burst Time"
            type="number"
            value={process.burst_time}
            onChange={handleChange('burst_time')}
            inputProps={{ min: 1 }}
            error={!process.burst_time || process.burst_time < 1}
            size="small"
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <TextField
            fullWidth
            label="Arrival Time"
            type="number"
            value={process.arrival_time || 0}
            onChange={handleChange('arrival_time')}
            inputProps={{ min: 0 }}
            size="small"
          />
        </Grid>
        {showPriority && (
          <Grid item xs={6} sm={3}>
            <PriorityInput process={process} onChange={onUpdate} />
          </Grid>
        )}
        <Grid item xs={12}>
          <Button 
            variant="outlined" 
            color="error" 
            onClick={() => onRemove(process.process_id)}
            size="small"
            startIcon={<span>×</span>}
            sx={{ mt: { xs: 1, sm: 0 } }}
          >
            Remove
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

// Algorithm-specific process form
const AlgorithmProcessForm: React.FC<{
  processes: Process[];
  onProcessesChange: (processes: Process[]) => void;
  requiresPriority: boolean;
}> = ({ processes, onProcessesChange, requiresPriority }) => {
  const [newProcess, setNewProcess] = useState<Process>({
    process_id: '',
    burst_time: 1,
    arrival_time: 0,
    priority: requiresPriority ? 1 : undefined
  });

  const handleAddProcess = () => {
    if (!newProcess.process_id || !newProcess.burst_time) {
      // Show validation error
      return;
    }

    // Ensure priority is set for priority algorithms
    const processToAdd = {
      ...newProcess,
      priority: requiresPriority ? (newProcess.priority || 1) : newProcess.priority
    };

    onProcessesChange([...processes, processToAdd]);

    // Reset new process form
    setNewProcess({
      process_id: '',
      burst_time: 1,
      arrival_time: 0,
      priority: requiresPriority ? 1 : undefined
    });
  };

  const handleUpdateProcess = (updatedProcess: Process) => {
    const updatedProcesses = processes.map(p => 
      p.process_id === updatedProcess.process_id ? updatedProcess : p
    );
    onProcessesChange(updatedProcesses);
  };

  const handleRemoveProcess = (processId: string) => {
    onProcessesChange(processes.filter(p => p.process_id !== processId));
  };

  const handleGenerateRandomProcesses = () => {
    const randomProcesses: Process[] = [];
    const count = 5; // Generate 5 processes
    
    for (let i = 0; i < count; i++) {
      randomProcesses.push({
        process_id: `P${i+1}`,
        burst_time: Math.floor(Math.random() * 10) + 1, // 1-10
        arrival_time: Math.floor(Math.random() * 5), // 0-4
        priority: requiresPriority ? Math.floor(Math.random() * 5) + 1 : undefined, // 1-5 if required
      });
    }
    
    onProcessesChange(randomProcesses);
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Add New Process
        </Typography>
        <Grid container spacing={{ xs: 1, sm: 2 }} alignItems="flex-end">
          <Grid item xs={6} sm={3}>
            <TextField
              fullWidth
              required
              label="Process ID"
              value={newProcess.process_id}
              onChange={(e) => setNewProcess({...newProcess, process_id: e.target.value})}
              error={!newProcess.process_id}
              size="small"
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              fullWidth
              required
              label="Burst Time"
              type="number"
              value={newProcess.burst_time}
              onChange={(e) => setNewProcess({...newProcess, burst_time: Number(e.target.value)})}
              inputProps={{ min: 1 }}
              error={!newProcess.burst_time || newProcess.burst_time < 1}
              size="small"
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              fullWidth
              label="Arrival Time"
              type="number"
              value={newProcess.arrival_time || 0}
              onChange={(e) => setNewProcess({...newProcess, arrival_time: Number(e.target.value)})}
              inputProps={{ min: 0 }}
              size="small"
            />
          </Grid>
          {requiresPriority && (
            <Grid item xs={6} sm={3}>
              <PriorityInput 
                process={newProcess} 
                onChange={(updatedProcess) => setNewProcess(updatedProcess)} 
              />
            </Grid>
          )}
          <Grid item xs={6} sm={requiresPriority ? 6 : 3}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddProcess}
              fullWidth
              size="small"
              disabled={!newProcess.process_id || !newProcess.burst_time || (requiresPriority && !newProcess.priority)}
              sx={{ py: { xs: 1, sm: 'auto' } }}
            >
              Add Process
            </Button>
          </Grid>
          <Grid item xs={6} sm={requiresPriority ? 6 : 3}>
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={handleGenerateRandomProcesses}
              fullWidth
              size="small"
              sx={{ py: { xs: 1, sm: 'auto' } }}
            >
              Generate Random
            </Button>
          </Grid>
        </Grid>
      </Box>

      {processes.length > 0 ? (
        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="subtitle1" 
            gutterBottom
            fontSize={{ xs: '0.9rem', sm: '1rem' }}
          >
            Configured Processes ({processes.length})
          </Typography>
          {processes.map((process) => (
            <ProcessConfigItem 
              key={process.process_id}
              process={process}
              onUpdate={handleUpdateProcess}
              onRemove={handleRemoveProcess}
              showPriority={requiresPriority}
            />
          ))}
        </Box>
      ) : (
        <Alert severity="info" sx={{ mb: 3 }}>
          No processes configured. Add processes using the form above.
        </Alert>
      )}
    </Box>
  );
};

const Compare: React.FC = () => {
  const [algorithmConfigs, setAlgorithmConfigs] = useState<Record<string, AlgorithmConfig>>({
    fcfs: { processes: [], enabled: true },
    sjf: { processes: [], enabled: true },
    srtf: { processes: [], enabled: true },
    priority: { processes: [], enabled: true },
    priority_preemptive: { processes: [], enabled: true },
    round_robin: { processes: [], timeQuantum: 2, enabled: true },
  });
  
  const [sharedProcesses, setSharedProcesses] = useState<Process[]>([]);
  const [useSharedProcesses, setUseSharedProcesses] = useState<boolean>(true);
  const [compareResult, setCompareResult] = useState<CompareResult | null>(null);
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Tab state for results display
  const [selectedTab, setSelectedTab] = useState<string>('overview');
  
  // Comparison view mode
  const [comparisonMode, setComparisonMode] = useState<string>('charts');

  // Validation state to track if processes have required parameters
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  // Helper function to determine if an algorithm has priority requirements
  const requiresPriority = (algorithm: string): boolean => {
    return algorithm === 'priority' || algorithm === 'priority_preemptive';
  };
  
  // Helper function to determine if an algorithm has time quantum requirements  
  const requiresTimeQuantum = (algorithm: string): boolean => {
    return algorithm === 'round_robin';
  };
  
  // Helper function to validate if processes have required parameters for an algorithm
  const validateProcesses = (algorithm: string, processes: Process[]): boolean => {
    if (processes.length === 0) {
      setValidationErrors(prev => ({
        ...prev,
        [algorithm]: 'No processes defined'
      }));
      return false;
    }
    
    if (requiresPriority(algorithm)) {
      const missingPriority = processes.some(p => p.priority === undefined || p.priority === 0);
      if (missingPriority) {
        setValidationErrors(prev => ({
          ...prev,
          [algorithm]: 'Priority values must be set for all processes'
        }));
        return false;
      }
    }
    
    if (requiresTimeQuantum(algorithm) && !algorithmConfigs[algorithm].timeQuantum) {
      setValidationErrors(prev => ({
        ...prev,
        [algorithm]: 'Time quantum must be set'
      }));
      return false;
    }
    
    // Clear any previous validation errors for this algorithm
    setValidationErrors(prev => {
      const newErrors = {...prev};
      delete newErrors[algorithm];
      return newErrors;
    });
    
    return true;
  };
  
  // Handler to receive processes from SimpleProcessForm for shared processes
  const handleSharedProcessesChange = (newProcesses: Process[]) => {
    // Make sure all processes have priority values set if any priority algorithm is enabled
    const priorityEnabled = Object.entries(algorithmConfigs)
      .some(([key, config]) => config.enabled && requiresPriority(key));
    
    if (priorityEnabled) {
      // Ensure all processes have priority values
      newProcesses = newProcesses.map(p => ({
        ...p,
        priority: p.priority || 1 // Default priority to 1 if not set
      }));
    }
    
    setSharedProcesses(newProcesses);
    
    // If using shared processes, update all algorithm configs
    if (useSharedProcesses) {
      const updatedConfigs = { ...algorithmConfigs };
      Object.keys(updatedConfigs).forEach(key => {
        updatedConfigs[key].processes = [...newProcesses];
        
        // Validate processes for this algorithm if it's enabled
        if (updatedConfigs[key].enabled) {
          validateProcesses(key, newProcesses);
        }
      });
      setAlgorithmConfigs(updatedConfigs);
    }
  };
  
  // Handler for time quantum change
  const handleTimeQuantumChange = (algorithm: string, newTimeQuantum: number) => {
    setAlgorithmConfigs(prevConfigs => ({
      ...prevConfigs,
      [algorithm]: {
        ...prevConfigs[algorithm],
        timeQuantum: newTimeQuantum
      }
    }));
    
    // Clear validation error for this algorithm if it was related to time quantum
    if (validationErrors[algorithm] && validationErrors[algorithm].includes('time quantum')) {
      setValidationErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[algorithm];
        return newErrors;
      });
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
  };

  const handleAlgorithmSelection = (algorithm: string, isEnabled: boolean) => {
    setAlgorithmConfigs(prevConfigs => ({
      ...prevConfigs,
      [algorithm]: {
        ...prevConfigs[algorithm],
        enabled: isEnabled
      }
    }));
    
    // If enabling an algorithm, validate its processes
    if (isEnabled) {
      validateProcesses(algorithm, algorithmConfigs[algorithm].processes);
    } else {
      // If disabling, remove any validation errors for this algorithm
      setValidationErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[algorithm];
        return newErrors;
      });
    }
  };
  
  const handleViewModeChange = (event: React.MouseEvent<HTMLElement>, newMode: string) => {
    if (newMode !== null) {
      setComparisonMode(newMode);
    }
  };
  
  const handleToggleSharedProcesses = (event: React.ChangeEvent<HTMLInputElement>) => {
    const useShared = event.target.checked;
    setUseSharedProcesses(useShared);
    
    // Clear validation errors when switching modes
    setValidationErrors({});
    
    // If switching to shared processes, update all algorithm configs with shared processes
    if (useShared && sharedProcesses.length > 0) {
      const updatedConfigs = { ...algorithmConfigs };
      Object.keys(updatedConfigs).forEach(key => {
        updatedConfigs[key].processes = [...sharedProcesses];
        
        // Validate processes for this algorithm if it's enabled
        if (updatedConfigs[key].enabled) {
          validateProcesses(key, sharedProcesses);
        }
      });
      setAlgorithmConfigs(updatedConfigs);
    } else if (!useShared) {
      // When switching to individual process mode, validate each algorithm's processes
      Object.entries(algorithmConfigs)
        .filter(([_, config]) => config.enabled)
        .forEach(([key, config]) => {
          validateProcesses(key, config.processes);
        });
    }
  };
  
  // Handler to update processes for a specific algorithm
  const handleAlgorithmProcessesChange = (algorithm: string, processes: Process[]) => {
    // Add default priority values if it's a priority algorithm and priority values are missing
    if (requiresPriority(algorithm)) {
      processes = processes.map(p => ({
        ...p,
        priority: p.priority || 1 // Default priority to 1 if not set
      }));
    }
    
    setAlgorithmConfigs(prevConfigs => ({
      ...prevConfigs,
      [algorithm]: {
        ...prevConfigs[algorithm],
        processes: processes
      }
    }));
    
    // Validate the processes for this algorithm
    validateProcesses(algorithm, processes);
  };

  const calculateComparison = async () => {
    // Reset validation errors
    setValidationErrors({});
    
    // Get enabled algorithms
    const enabledAlgorithms = Object.entries(algorithmConfigs)
      .filter(([_, config]) => config.enabled)
      .map(([key]) => key);
    
    if (enabledAlgorithms.length === 0) {
      setError('Please select at least one algorithm to compare');
      return;
    }
    
    // Validate each enabled algorithm's processes
    let hasValidationErrors = false;
    
    enabledAlgorithms.forEach(algorithm => {
      const config = algorithmConfigs[algorithm];
      const isValid = validateProcesses(algorithm, config.processes);
      if (!isValid) {
        hasValidationErrors = true;
      }
    });
    
    if (hasValidationErrors) {
      setError('Please fix the validation errors before comparing algorithms');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Calculate results for each algorithm separately
      const results: Partial<CompareResult> = {};
      
      for (const algorithm of enabledAlgorithms) {
        const config = algorithmConfigs[algorithm];
        
        // Validate processes data
        const validProcesses = config.processes.map(p => ({
          ...p,
          burst_time: Number(p.burst_time),
          arrival_time: Number(p.arrival_time || 0),
          priority: requiresPriority(algorithm) ? Number(p.priority || 1) : Number(p.priority || 0)
        }));
        
        // Log the data being sent to the algorithm for debugging
        console.log(`Processes for ${algorithm}:`, validProcesses);
        
        // Call the algorithm function for the specific algorithm
        const timeQuantum = requiresTimeQuantum(algorithm) ? (config.timeQuantum || 2) : 2;
        
        // Log process data specifically for the preemptive priority algorithm
        if (algorithm === 'priority_preemptive') {
          console.log('Priority values for each process in priority_preemptive:');
          validProcesses.forEach(p => {
            console.log(`Process ${p.process_id}: Priority = ${p.priority}`);
          });
        }
        
        console.log(`Calculating ${algorithm} with processes:`, validProcesses);
        
        // Ensure the proper function call for each algorithm
        if (algorithm === 'round_robin') {
          const result = compareAlgorithms(validProcesses, timeQuantum);
          console.log(`Round Robin result with time quantum ${timeQuantum}:`, result.round_robin);
          results[algorithm] = result.round_robin;
        } else if (algorithm === 'priority_preemptive') {
          const result = compareAlgorithms(validProcesses, 2);
          console.log('Priority Preemptive result:', result.priority_preemptive);
          results[algorithm] = result.priority_preemptive;
        } else {
          const result = compareAlgorithms(validProcesses, 2);
          console.log(`${algorithm} result:`, result[algorithm]);
          results[algorithm] = result[algorithm];
        }
      }
      
      console.log('Comparison results:', results);
      
      // Type the results as CompareResult, with undefined for disabled algorithms
      const typedResult: CompareResult = {
        fcfs: results.fcfs as AlgorithmResult,
        sjf: results.sjf as AlgorithmResult,
        srtf: results.srtf as AlgorithmResult,
        priority: results.priority as AlgorithmResult,
        priority_preemptive: results.priority_preemptive as AlgorithmResult,
        round_robin: results.round_robin as AlgorithmResult
      };
      
      setCompareResult(typedResult);
      setSelectedTab('overview'); // Reset to overview tab
    } catch (err) {
      console.error('Error calculating comparison:', err);
      setError('Failed to calculate comparison. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get selected algorithms
  const getSelectedAlgorithms = (): string[] => {
    return Object.entries(algorithmConfigs)
      .filter(([_, config]) => config.enabled)
      .map(([key]) => key);
  };

  // Prepare data for the performance comparison chart
  const preparePerformanceData = (): PerformanceData[] => {
    if (!compareResult) return [];

    return Object.entries(compareResult)
      .filter(([key, value]) => algorithmConfigs[key]?.enabled && value !== undefined)
      .map(([key, value]) => {
        if (!value) {
          return {
            name: shortAlgorithmNames[key] || key,
            avg_waiting_time: 0,
            avg_turnaround_time: 0,
          };
        }
        return {
          name: shortAlgorithmNames[key] || key,
          avg_waiting_time: parseFloat(value.avg_waiting_time.toFixed(2)),
          avg_turnaround_time: parseFloat(value.avg_turnaround_time.toFixed(2)),
        };
      });
  };
  
  // Prepare data for selected algorithms only
  const prepareSelectedAlgorithmsData = (): PerformanceData[] => {
    if (!compareResult) return [];
    
    const selectedAlgos = getSelectedAlgorithms();

    return Object.entries(compareResult)
      .filter(([key, value]) => selectedAlgos.includes(key) && value !== undefined)
      .map(([key, value]) => {
        if (!value) {
          return {
            name: shortAlgorithmNames[key] || key,
            avg_waiting_time: 0,
            avg_turnaround_time: 0,
          };
        }
        return {
          name: shortAlgorithmNames[key] || key,
          avg_waiting_time: parseFloat(value.avg_waiting_time.toFixed(2)),
          avg_turnaround_time: parseFloat(value.avg_turnaround_time.toFixed(2)),
        };
      });
  };

  // Helper function to get all process IDs across all algorithm configurations
  const getAllProcessIds = (): string[] => {
    const processIds = new Set<string>();
    
    Object.entries(algorithmConfigs)
      .filter(([_, config]) => config.enabled)
      .forEach(([_, config]) => {
        config.processes.forEach(process => {
          processIds.add(process.process_id);
        });
      });
    
    return Array.from(processIds);
  };

  return (
    <Box>
      <Paper sx={{ 
        p: { xs: 2, sm: 3 }, 
        mb: 4, 
        background: 'linear-gradient(135deg, #7e57c2 0%, #b39ddb 100%)', 
        color: 'white' 
      }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}>
          Compare CPU Scheduling Algorithms
        </Typography>
        <Typography variant="body1" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
          Configure your processes and compare how different CPU scheduling algorithms perform
        </Typography>
      </Paper>
      
      <Box sx={{ mb: 4 }}>
        <Paper sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
            Process Configuration
          </Typography>
          
          <FormControlLabel
            control={
              <Checkbox 
                checked={useSharedProcesses}
                onChange={handleToggleSharedProcesses}
              />
            }
            label="Use same processes for all algorithms"
            sx={{ mb: 2 }}
          />
          
          {useSharedProcesses ? (
            // Shared processes configuration
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Configure the processes below that will be used for all selected algorithms
              </Typography>
              
              {/* Check if any priority algorithm is enabled to determine if priority field should be shown */}
              {Object.entries(algorithmConfigs).some(([key, config]) => config.enabled && requiresPriority(key)) && (
                <Box sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="body2" color="primary" sx={{ mb: 1, fontWeight: 'bold' }}>
                    Note: Priority values are required because you have Priority-based algorithms enabled. 
                    Lower values indicate higher priority.
                  </Typography>
                </Box>
              )}
              
              <AlgorithmProcessForm 
                processes={sharedProcesses}
                onProcessesChange={handleSharedProcessesChange}
                requiresPriority={Object.entries(algorithmConfigs).some(([key, config]) => config.enabled && requiresPriority(key))}
              />
            </>
          ) : (
            // Individual algorithm process configuration
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Configure processes for each algorithm separately
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Select Algorithms to Compare
                </Typography>
                <FormGroup sx={{ flexDirection: { xs: 'column', sm: 'row' } }}>
                  {algorithmKeys.map(algoKey => (
                    <FormControlLabel
                      key={algoKey}
                      control={
                        <Checkbox 
                          checked={algorithmConfigs[algoKey]?.enabled || false}
                          onChange={(e) => handleAlgorithmSelection(algoKey, e.target.checked)}
                          name={algoKey}
                        />
                      }
                      label={algorithmNames[algoKey]}
                      sx={{ mr: { xs: 0, sm: 2 }, mb: { xs: 1, sm: 0 } }}
                    />
                  ))}
                </FormGroup>
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              {/* Accordion for each algorithm configuration */}
              {algorithmKeys.map(algoKey => (
                algorithmConfigs[algoKey]?.enabled && (
                  <Accordion key={algoKey} sx={{ mb: 2 }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`${algoKey}-content`}
                      id={`${algoKey}-header`}
                    >
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'flex-start', sm: 'center' }, 
                        width: '100%', 
                        justifyContent: 'space-between' 
                      }}>
                        <Typography fontSize={{ xs: '0.9rem', sm: '1rem' }}>{algorithmNames[algoKey]}</Typography>
                        {validationErrors[algoKey] && (
                          <Typography 
                            color="error" 
                            variant="caption" 
                            sx={{ 
                              ml: { xs: 0, sm: 2 },
                              mt: { xs: 1, sm: 0 }
                            }}
                          >
                            {validationErrors[algoKey]}
                          </Typography>
                        )}
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      {requiresTimeQuantum(algoKey) && (
                        <Box sx={{ mb: 2 }}>
                          <TextField
                            label="Time Quantum"
                            type="number"
                            value={algorithmConfigs[algoKey]?.timeQuantum || 2}
                            onChange={(e) => handleTimeQuantumChange(algoKey, Number(e.target.value))}
                            inputProps={{ min: 1 }}
                            sx={{ width: { xs: '100%', sm: 200 } }}
                            size="small"
                            error={validationErrors[algoKey]?.includes('time quantum')}
                            helperText={validationErrors[algoKey]?.includes('time quantum') ? validationErrors[algoKey] : ''}
                          />
                        </Box>
                      )}
                      
                      {requiresPriority(algoKey) && (
                        <Box sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                          <Typography variant="body2" color="primary" sx={{ mb: 1, fontWeight: 'bold' }}>
                            Note: Priority values are required for this algorithm. Lower values indicate higher priority.
                          </Typography>
                        </Box>
                      )}
                      
                      <AlgorithmProcessForm 
                        processes={algorithmConfigs[algoKey].processes}
                        onProcessesChange={(processes) => handleAlgorithmProcessesChange(algoKey, processes)}
                        requiresPriority={requiresPriority(algoKey)}
                      />
                    </AccordionDetails>
                  </Accordion>
                )
              ))}
            </>
          )}
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={calculateComparison}
              disabled={loading}
              sx={{ 
                px: { xs: 3, sm: 4 }, 
                py: { xs: 1, sm: 1.5 }, 
                fontSize: { xs: '0.875rem', sm: '1rem' },
                background: 'linear-gradient(135deg, #2F4BBF 0%, #5A7CFF 100%)',
                boxShadow: '0 4px 12px rgba(47, 75, 191, 0.25)',
                width: { xs: '100%', sm: 'auto' },
                maxWidth: { xs: '250px', sm: 'none' }
              }}
            >
              {loading ? <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} /> : null}
              Compare Algorithms
            </Button>
          </Box>
          
          {/* Display validation errors summary */}
          {Object.keys(validationErrors).length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Alert severity="warning" sx={{ mb: 2, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                <Typography variant="subtitle1" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>Please fix the following issues:</Typography>
                <ul style={{ marginTop: 8, paddingLeft: 16 }}>
                  {Object.entries(validationErrors).map(([algorithm, error]) => (
                    <li key={algorithm}>
                      <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                        <strong>{algorithmNames[algorithm]}</strong>: {error}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </Alert>
            </Box>
          )}
        </Paper>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      )}
      
      {compareResult && (
        <Box sx={{ mt: 4 }}>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ 
              mb: 3,
              '.MuiTabs-flexContainer': {
                flexWrap: { xs: 'wrap', sm: 'nowrap' }
              },
              '.MuiTab-root': {
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                minWidth: { xs: '80px', sm: '120px' },
                padding: { xs: '6px 8px', sm: '12px 16px' }
              }
            }}
          >
            <Tab label="Overview" value="overview" />
            <Tab label="Compare Side-by-Side" value="side-by-side" />
            <Tab label="FCFS" value="fcfs" />
            <Tab label="SJF" value="sjf" />
            <Tab label="SRTF" value="srtf" />
            <Tab label="Priority" value="priority" />
            <Tab label="Priority (Preemptive)" value="priority_preemptive" />
            <Tab label="Round Robin" value="round_robin" />
          </Tabs>
          
          {selectedTab === 'overview' && (
            <Box>
              <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                  Performance Comparison
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Lower values are better for both metrics
                </Typography>
                
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={preparePerformanceData()}
                    margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      height={50}
                      tick={{ fontSize: 14 }}
                    />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend wrapperStyle={{ paddingTop: 20 }} />
                    <Bar dataKey="avg_waiting_time" name="Avg Waiting Time" fill="#8884d8" />
                    <Bar dataKey="avg_turnaround_time" name="Avg Turnaround Time" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: { xs: 2, sm: 3 } }}>
                    <Typography variant="h6" gutterBottom fontSize={{ xs: '1rem', sm: '1.25rem' }}>
                      Best Algorithm for Waiting Time
                    </Typography>
                    
                    {(() => {
                      const algorithms = Object.entries(compareResult);
                      const bestWaitingTime = algorithms.reduce((best, [key, value]) => {
                        if (!value) return best;
                        return value.avg_waiting_time < best.waiting ? { 
                          name: algorithmNames[key], 
                          waiting: value.avg_waiting_time 
                        } : best;
                      }, { name: '', waiting: Infinity });
                      
                      return (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography variant="body1">
                            {bestWaitingTime.name}
                          </Typography>
                          <Typography variant="h5" color="primary">
                            {bestWaitingTime.waiting.toFixed(2)}
                          </Typography>
                        </Box>
                      );
                    })()}
                  </Paper>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: { xs: 2, sm: 3 } }}>
                    <Typography variant="h6" gutterBottom fontSize={{ xs: '1rem', sm: '1.25rem' }}>
                      Best Algorithm for Turnaround Time
                    </Typography>
                    
                    {(() => {
                      const algorithms = Object.entries(compareResult);
                      const bestTurnaroundTime = algorithms.reduce((best, [key, value]) => {
                        if (!value) return best;
                        return value.avg_turnaround_time < best.turnaround ? { 
                          name: algorithmNames[key], 
                          turnaround: value.avg_turnaround_time 
                        } : best;
                      }, { name: '', turnaround: Infinity });
                      
                      return (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography variant="body1">
                            {bestTurnaroundTime.name}
                          </Typography>
                          <Typography variant="h5" color="primary">
                            {bestTurnaroundTime.turnaround.toFixed(2)}
                          </Typography>
                        </Box>
                      );
                    })()}
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}
          
          {selectedTab === 'side-by-side' && (
            <Box>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Select Algorithms to Compare
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormGroup row>
                      {algorithmKeys.map(algoKey => (
                        <FormControlLabel
                          key={algoKey}
                          control={
                            <Checkbox 
                              checked={algorithmConfigs[algoKey]?.enabled || false}
                              onChange={(e) => handleAlgorithmSelection(algoKey, e.target.checked)}
                              name={algoKey}
                            />
                          }
                          label={algorithmNames[algoKey]}
                        />
                      ))}
                    </FormGroup>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: { xs: 'flex-start', sm: 'flex-end' },
                      mt: { xs: 2, sm: 0 }
                    }}>
                      <Typography variant="body2" sx={{ mr: 2 }}>View Mode:</Typography>
                      <ToggleButtonGroup
                        value={comparisonMode}
                        exclusive
                        onChange={handleViewModeChange}
                        size="small"
                      >
                        <ToggleButton value="charts" aria-label="Charts">
                          <BarChartIcon />
                        </ToggleButton>
                        <ToggleButton value="gantt" aria-label="Gantt">
                          <ViewWeekIcon />
                        </ToggleButton>
                        <ToggleButton value="table" aria-label="Table">
                          <TableChartIcon />
                        </ToggleButton>
                      </ToggleButtonGroup>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
              
              {comparisonMode === 'charts' && (
                <Box>
                  <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                      Performance Comparison
                    </Typography>
                    
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart
                        data={prepareSelectedAlgorithmsData()}
                        margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="name" 
                          height={50}
                          tick={{ fontSize: 14 }}
                        />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend wrapperStyle={{ paddingTop: 20 }} />
                        <Bar dataKey="avg_waiting_time" name="Avg Waiting Time" fill="#8884d8" />
                        <Bar dataKey="avg_turnaround_time" name="Avg Turnaround Time" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Paper>
                </Box>
              )}
              
              {comparisonMode === 'gantt' && (
                <Box>
                  <Grid container spacing={3}>
                    {getSelectedAlgorithms().map(algoKey => (
                      compareResult[algoKey] && (
                        <Grid key={algoKey} item xs={12}>
                          <Paper sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" gutterBottom>
                              {algorithmNames[algoKey]}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Avg. Waiting Time: {compareResult[algoKey]?.avg_waiting_time.toFixed(2) || 'N/A'} | 
                              Avg. Turnaround Time: {compareResult[algoKey]?.avg_turnaround_time.toFixed(2) || 'N/A'}
                            </Typography>
                            
                            <GanttChart 
                              data={compareResult[algoKey]?.gantt_data || []} 
                              title="Gantt Chart" 
                              autoPlay={false}
                              algorithm={algoKey}
                            />
                          </Paper>
                        </Grid>
                      )
                    ))}
                  </Grid>
                </Box>
              )}
              
              {comparisonMode === 'table' && (
                <Box>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Comparison Table
                    </Typography>
                    
                    <Box sx={{ overflowX: 'auto', maxWidth: '100vw' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem', minWidth: '650px', fontSize: '0.9rem' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#f5f5f5' }}>
                            <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Algorithm</th>
                            <th style={{ padding: '12px 16px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Avg. Waiting Time</th>
                            <th style={{ padding: '12px 16px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Avg. Turnaround Time</th>
                            <th style={{ padding: '12px 16px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Process Order</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getSelectedAlgorithms().map(algoKey => (
                            compareResult[algoKey] && (
                              <tr key={algoKey} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '12px 16px', fontWeight: 500 }}>{algorithmNames[algoKey]}</td>
                                <td style={{ padding: '12px 16px', textAlign: 'center' }}>{compareResult[algoKey]?.avg_waiting_time.toFixed(2) || 'N/A'}</td>
                                <td style={{ padding: '12px 16px', textAlign: 'center' }}>{compareResult[algoKey]?.avg_turnaround_time.toFixed(2) || 'N/A'}</td>
                                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                  {compareResult[algoKey]?.gantt_data.map(block => block.process_id).filter((value, index, self) => self.indexOf(value) === index).join(' → ') || 'N/A'}
                                </td>
                              </tr>
                            )
                          ))}
                        </tbody>
                      </table>
                    </Box>
                    
                    <Typography variant="subtitle1" sx={{ mt: 4, mb: 2 }}>
                      Process-Level Comparison
                    </Typography>
                    
                    <Box sx={{ overflowX: 'auto', maxWidth: '100vw' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem', minWidth: '800px', fontSize: '0.9rem' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#f5f5f5' }}>
                            <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Process ID</th>
                            <th style={{ padding: '12px 16px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Burst Time</th>
                            {getSelectedAlgorithms().map(algoKey => (
                              compareResult[algoKey] && (
                                <React.Fragment key={algoKey}>
                                  <th style={{ padding: '12px 16px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>
                                    {algorithmNames[algoKey]} (WT)
                                  </th>
                                  <th style={{ padding: '12px 16px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>
                                    {algorithmNames[algoKey]} (TAT)
                                  </th>
                                </React.Fragment>
                              )
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {useSharedProcesses ? (
                            // For shared processes
                            sharedProcesses.map(process => (
                              <tr key={process.process_id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '12px 16px', fontWeight: 500 }}>{process.process_id}</td>
                                <td style={{ padding: '12px 16px', textAlign: 'center' }}>{process.burst_time}</td>
                                
                                {getSelectedAlgorithms().map(algoKey => {
                                  if (!compareResult[algoKey]) return null;
                                  
                                  const processResult = compareResult[algoKey]?.results.find(
                                    res => res.process_id === process.process_id
                                  );
                                  
                                  return (
                                    <React.Fragment key={algoKey}>
                                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                        {processResult ? processResult.waiting_time.toFixed(2) : 'N/A'}
                                      </td>
                                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                        {processResult ? processResult.turnaround_time.toFixed(2) : 'N/A'}
                                      </td>
                                    </React.Fragment>
                                  );
                                })}
                              </tr>
                            ))
                          ) : (
                            // For algorithm-specific processes, create a combined list
                            getAllProcessIds().map(processId => (
                              <tr key={processId} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '12px 16px', fontWeight: 500 }}>{processId}</td>
                                <td style={{ padding: '12px 16px', textAlign: 'center' }}>Varies</td>
                                
                                {getSelectedAlgorithms().map(algoKey => {
                                  if (!compareResult[algoKey]) return null;
                                  
                                  const processResult = compareResult[algoKey]?.results.find(
                                    res => res.process_id === processId
                                  );
                                  
                                  return (
                                    <React.Fragment key={algoKey}>
                                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                        {processResult ? processResult.waiting_time.toFixed(2) : 'N/A'}
                                      </td>
                                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                        {processResult ? processResult.turnaround_time.toFixed(2) : 'N/A'}
                                      </td>
                                    </React.Fragment>
                                  );
                                })}
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </Box>
                  </Paper>
                </Box>
              )}
            </Box>
          )}
          
          {selectedTab === 'fcfs' && (
            <Box>
              <Typography variant="h6" gutterBottom>
                First Come First Serve (FCFS)
              </Typography>
              {compareResult?.fcfs && (
                <>
                  <GanttChart data={compareResult.fcfs.gantt_data} title="Gantt Chart" />
                  <ResultsTable
                    results={compareResult.fcfs.results}
                    avgWaitingTime={compareResult.fcfs.avg_waiting_time}
                    avgTurnaroundTime={compareResult.fcfs.avg_turnaround_time}
                    title="Process Details"
                  />
                </>
              )}
            </Box>
          )}
          
          {selectedTab === 'sjf' && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Shortest Job First (SJF)
              </Typography>
              {compareResult?.sjf && (
                <>
                  <GanttChart data={compareResult.sjf.gantt_data} title="Gantt Chart" />
                  <ResultsTable
                    results={compareResult.sjf.results}
                    avgWaitingTime={compareResult.sjf.avg_waiting_time}
                    avgTurnaroundTime={compareResult.sjf.avg_turnaround_time}
                    title="Process Details"
                  />
                </>
              )}
            </Box>
          )}
          
          {selectedTab === 'srtf' && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Shortest Remaining Time First (SRTF)
              </Typography>
              {compareResult?.srtf && (
                <>
                  <GanttChart data={compareResult.srtf.gantt_data} title="Gantt Chart" />
                  <ResultsTable
                    results={compareResult.srtf.results}
                    avgWaitingTime={compareResult.srtf.avg_waiting_time}
                    avgTurnaroundTime={compareResult.srtf.avg_turnaround_time}
                    title="Process Details"
                  />
                </>
              )}
            </Box>
          )}
          
          {selectedTab === 'priority' && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Priority Scheduling
              </Typography>
              {compareResult?.priority && (
                <>
                  <GanttChart data={compareResult.priority.gantt_data} title="Gantt Chart" />
                  <ResultsTable
                    results={compareResult.priority.results}
                    avgWaitingTime={compareResult.priority.avg_waiting_time}
                    avgTurnaroundTime={compareResult.priority.avg_turnaround_time}
                    title="Process Details"
                  />
                </>
              )}
            </Box>
          )}
          
          {selectedTab === 'priority_preemptive' && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Priority Scheduling (Preemptive)
              </Typography>
              {compareResult?.priority_preemptive && (
                <>
                  <GanttChart data={compareResult.priority_preemptive.gantt_data} title="Gantt Chart" />
                  <ResultsTable
                    results={compareResult.priority_preemptive.results}
                    avgWaitingTime={compareResult.priority_preemptive.avg_waiting_time}
                    avgTurnaroundTime={compareResult.priority_preemptive.avg_turnaround_time}
                    title="Process Details"
                  />
                </>
              )}
            </Box>
          )}
          
          {selectedTab === 'round_robin' && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Round Robin (Time Quantum: {algorithmConfigs.round_robin?.timeQuantum || 2})
              </Typography>
              {compareResult?.round_robin && (
                <>
                  <GanttChart data={compareResult.round_robin.gantt_data} title="Gantt Chart" />
                  <ResultsTable
                    results={compareResult.round_robin.results}
                    avgWaitingTime={compareResult.round_robin.avg_waiting_time}
                    avgTurnaroundTime={compareResult.round_robin.avg_turnaround_time}
                    title="Process Details"
                  />
                </>
              )}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Compare; 