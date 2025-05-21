import { fcfs, sjf, srtf, priorityScheduling, roundRobin, compareAlgorithms } from '../utils/schedulingAlgorithms';

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

// Define the Compare Result interface
export interface CompareResult {
  fcfs: AlgorithmResult;
  sjf: AlgorithmResult;
  srtf: AlgorithmResult;
  priority: AlgorithmResult;
  round_robin: AlgorithmResult;
}

// API functions
export const api = {
  // FCFS algorithm
  fcfs: async (processes: Process[]): Promise<AlgorithmResult> => {
    return fcfs(processes);
  },

  // SJF algorithm
  sjf: async (processes: Process[]): Promise<AlgorithmResult> => {
    return sjf(processes);
  },

  // SRTF algorithm
  srtf: async (processes: Process[]): Promise<AlgorithmResult> => {
    return srtf(processes);
  },

  // Priority scheduling algorithm
  priority: async (processes: Process[], isPreemptive: boolean = false): Promise<AlgorithmResult> => {
    return priorityScheduling(processes, isPreemptive);
  },

  // Round Robin algorithm
  roundRobin: async (processes: Process[], timeQuantum: number): Promise<AlgorithmResult> => {
    return roundRobin(processes, timeQuantum);
  },

  // Compare all algorithms
  compare: async (processes: Process[], timeQuantum: number): Promise<Record<string, AlgorithmResult>> => {
    return compareAlgorithms(processes, timeQuantum);
  },
}; 