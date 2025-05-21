import { fcfs, sjf, srtf, priorityScheduling, roundRobin } from '../utils/schedulingAlgorithms';

// Define the Process interface
export interface Process {
  process_id: string;
  burst_time: number;
  arrival_time?: number;
  priority?: number;
}

// Define the Result interface
export interface Result {
  process_id: string;
  burst_time: number;
  waiting_time: number;
  turnaround_time: number;
  completion_time?: number;
  arrival_time?: number;
  priority?: number;
}

// Define the GanttData interface
export interface GanttData {
  process_id: string;
  start_time: number;
  end_time: number;
}

// Define the Algorithm Result interface
export interface AlgorithmResult {
  results: Result[];
  avg_waiting_time: number;
  avg_turnaround_time: number;
  gantt_data: GanttData[];
}

// API functions
export const api = {
  // Calculate function that calls the appropriate algorithm function directly
  calculate: async (algorithm: string, processes: Process[], timeQuantum?: number): Promise<AlgorithmResult> => {
    try {
      let result;
      
      switch (algorithm) {
        case 'fcfs':
          result = fcfs(processes);
          break;
        case 'sjf':
          result = sjf(processes);
          break;
        case 'srtf':
          result = srtf(processes);
          break;
        case 'priority':
          result = priorityScheduling(processes, false);
          break;
        case 'priority-preemptive':
          result = priorityScheduling(processes, true);
          break;
        case 'round-robin':
          result = roundRobin(processes, timeQuantum || 2);
          break;
        default:
          throw new Error('Unknown algorithm');
      }
      
      return result;
    } catch (error) {
      console.error('Calculation error:', error);
      throw error;
    }
  },
}; 