// Scheduling Algorithms Implementation

// Helper function to calculate average for a property in an array of objects
const calculateAverage = (arr, property) => {
  return arr.reduce((sum, item) => sum + item[property], 0) / arr.length;
};

// First Come First Serve Algorithm (FCFS)
export const fcfs = (processes) => {
  const results = [];
  const ganttData = [];
  
  // Sort by arrival time, then by process id
  const sortedProcesses = [...processes].sort((a, b) => {
    if ((a.arrival_time || 0) !== (b.arrival_time || 0)) {
      return (a.arrival_time || 0) - (b.arrival_time || 0);
    }
    return a.process_id.localeCompare(b.process_id);
  });
  
  let currentTime = 0;
  
  sortedProcesses.forEach((process) => {
    const arrivalTime = process.arrival_time || 0;
    const burstTime = process.burst_time;
    
    // Update current time if a process arrives after the previous one finishes
    if (arrivalTime > currentTime) {
      currentTime = arrivalTime;
    }
    
    const startTime = currentTime;
    const completionTime = currentTime + burstTime;
    const turnaroundTime = completionTime - arrivalTime;
    const waitingTime = turnaroundTime - burstTime;
    
    results.push({
      process_id: process.process_id,
      burst_time: burstTime,
      arrival_time: arrivalTime,
      completion_time: completionTime,
      turnaround_time: turnaroundTime,
      waiting_time: waitingTime,
      priority: process.priority
    });
    
    ganttData.push({
      process_id: process.process_id,
      start_time: startTime,
      end_time: completionTime,
      arrival_time: arrivalTime
    });
    
    currentTime = completionTime;
  });
  
  return {
    results,
    avg_waiting_time: calculateAverage(results, 'waiting_time'),
    avg_turnaround_time: calculateAverage(results, 'turnaround_time'),
    gantt_data: ganttData
  };
};

// Shortest Job First (SJF) - Non-preemptive
export const sjf = (processes) => {
  const results = [];
  const ganttData = [];
  const completedProcesses = new Set();
  
  // Create a copy with arrival times (default to 0 if not specified)
  const processesWithArrival = processes.map(p => ({
    ...p,
    arrival_time: p.arrival_time || 0
  }));
  
  let currentTime = 0;
  
  while (completedProcesses.size < processes.length) {
    // Find available processes that have arrived but not completed
    const time = currentTime; // Store current time in a variable to avoid closure issue
    const availableProcesses = processesWithArrival.filter(p => 
      p.arrival_time <= time && !completedProcesses.has(p.process_id)
    );
    
    if (availableProcesses.length === 0) {
      // No processes available, jump to next arrival time
      const time = currentTime; // Store current time in a variable to avoid closure issue
      const nextArrival = processesWithArrival
        .filter(p => p.arrival_time > time)
        .sort((a, b) => a.arrival_time - b.arrival_time)[0];
      
      if (nextArrival) {
        currentTime = nextArrival.arrival_time;
      } else {
        // Shouldn't reach here, but just in case
        break;
      }
      continue;
    }
    
    // Sort available processes by burst time
    const nextProcess = availableProcesses.sort((a, b) => {
      if (a.burst_time !== b.burst_time) {
        return a.burst_time - b.burst_time;
      }
      return a.arrival_time - b.arrival_time;
    })[0];
    
    const startTime = currentTime;
    const completionTime = currentTime + nextProcess.burst_time;
    const turnaroundTime = completionTime - nextProcess.arrival_time;
    const waitingTime = turnaroundTime - nextProcess.burst_time;
    
    results.push({
      process_id: nextProcess.process_id,
      burst_time: nextProcess.burst_time,
      arrival_time: nextProcess.arrival_time,
      completion_time: completionTime,
      turnaround_time: turnaroundTime,
      waiting_time: waitingTime,
      priority: nextProcess.priority
    });
    
    ganttData.push({
      process_id: nextProcess.process_id,
      start_time: startTime,
      end_time: completionTime,
      arrival_time: nextProcess.arrival_time
    });
    
    currentTime = completionTime;
    completedProcesses.add(nextProcess.process_id);
  }
  
  return {
    results: results.sort((a, b) => a.process_id.localeCompare(b.process_id)),
    avg_waiting_time: calculateAverage(results, 'waiting_time'),
    avg_turnaround_time: calculateAverage(results, 'turnaround_time'),
    gantt_data: ganttData
  };
};

// Shortest Remaining Time First (SRTF) - Preemptive
export const srtf = (processes) => {
  // Placeholder implementation - provides a simplified simulation
  const results = {};
  const ganttData = [];
  
  // Create a copy with arrival times (default to 0 if not specified)
  const processesWithArrival = processes.map(p => ({
    ...p,
    arrival_time: p.arrival_time || 0,
    remaining_time: p.burst_time,
    first_run: null,
    last_run: null,
    completion_time: 0
  }));
  
  // Get all arrival times for event-based simulation
  const events = [...new Set(processesWithArrival.map(p => p.arrival_time))].sort((a, b) => a - b);
  
  // Add event at time 0 if no process starts at time 0
  if (!events.includes(0)) {
    events.unshift(0);
  }
  
  let currentTime = 0;
  let currentProcess = null;
  let lastProcessId = null;
  
  // Continue until all processes are completed
  while (processesWithArrival.some(p => p.remaining_time > 0)) {
    // Find available processes at current time
    const time = currentTime; // Store current time in a variable to avoid closure issue
    const availableProcesses = processesWithArrival.filter(p => 
      p.arrival_time <= time && p.remaining_time > 0
    );
    
    if (availableProcesses.length === 0) {
      // No processes available, jump to next arrival time
      const time = currentTime; // Store current time in a variable to avoid closure issue
      const nextArrival = processesWithArrival
        .filter(p => p.arrival_time > time && p.remaining_time > 0)
        .sort((a, b) => a.arrival_time - b.arrival_time)[0];
      
      if (nextArrival) {
        currentTime = nextArrival.arrival_time;
      } else {
        // Shouldn't reach here, but just in case
        break;
      }
      continue;
    }
    
    // Find the process with the shortest remaining time
    currentProcess = availableProcesses.sort((a, b) => {
      if (a.remaining_time !== b.remaining_time) {
        return a.remaining_time - b.remaining_time;
      }
      return a.arrival_time - b.arrival_time;
    })[0];
    
    // Determine the next event time
    const nextEventTime = processesWithArrival
      .filter(p => p.arrival_time > currentTime)
      .sort((a, b) => a.arrival_time - b.arrival_time)[0]?.arrival_time || Infinity;
    
    // Determine how long this process will run
    const runTime = Math.min(currentProcess.remaining_time, nextEventTime - currentTime);
    
    // Create a gantt entry if the process changes
    if (lastProcessId !== currentProcess.process_id) {
      ganttData.push({
        process_id: currentProcess.process_id,
        start_time: currentTime,
        end_time: currentTime + runTime,
        arrival_time: currentProcess.arrival_time
      });
    } else {
      // Extend the last gantt entry
      ganttData[ganttData.length - 1].end_time = currentTime + runTime;
    }
    
    // Update process remaining time
    currentProcess.remaining_time -= runTime;
    
    // Update completion time if process is finished
    if (currentProcess.remaining_time === 0) {
      currentProcess.completion_time = currentTime + runTime;
    }
    
    // Update time and last process
    currentTime += runTime;
    lastProcessId = currentProcess.process_id;
  }
  
  // Calculate turnaround and waiting times
  processesWithArrival.forEach(process => {
    const turnaroundTime = process.completion_time - process.arrival_time;
    const waitingTime = turnaroundTime - process.burst_time;
    
    results[process.process_id] = {
      process_id: process.process_id,
      burst_time: process.burst_time,
      arrival_time: process.arrival_time,
      completion_time: process.completion_time,
      turnaround_time: turnaroundTime,
      waiting_time: waitingTime,
      priority: process.priority
    };
  });
  
  const resultArray = Object.values(results);
  
  return {
    results: resultArray.sort((a, b) => a.process_id.localeCompare(b.process_id)),
    avg_waiting_time: calculateAverage(resultArray, 'waiting_time'),
    avg_turnaround_time: calculateAverage(resultArray, 'turnaround_time'),
    gantt_data: ganttData
  };
};

// Priority Scheduling 
export const priorityScheduling = (processes, isPreemptive = false) => {
  // For non-preemptive priority scheduling
  if (!isPreemptive) {
    const results = [];
    const ganttData = [];
    const completedProcesses = new Set();
    
    // Create a copy with arrival times (default to 0 if not specified)
    const processesWithArrival = processes.map(p => ({
      ...p,
      arrival_time: p.arrival_time || 0,
      priority: p.priority !== undefined ? p.priority : 0  // Default priority = 0
    }));
    
    let currentTime = 0;
    
    while (completedProcesses.size < processes.length) {
      // Find available processes that have arrived but not completed
      const availableProcesses = processesWithArrival.filter(p => 
        p.arrival_time <= currentTime && !completedProcesses.has(p.process_id)
      );
      
      if (availableProcesses.length === 0) {
        // No processes available, jump to next arrival time
        const nextArrival = processesWithArrival
          .filter(p => p.arrival_time > currentTime)
          .sort((a, b) => a.arrival_time - b.arrival_time)[0];
        
        if (nextArrival) {
          currentTime = nextArrival.arrival_time;
        } else {
          break;
        }
        continue;
      }
      
      // Sort available processes by priority (lower number = higher priority)
      const nextProcess = availableProcesses.sort((a, b) => {
        if (a.priority !== b.priority) {
          return a.priority - b.priority;
        }
        return a.arrival_time - b.arrival_time;
      })[0];
      
      const startTime = currentTime;
      const completionTime = currentTime + nextProcess.burst_time;
      const turnaroundTime = completionTime - nextProcess.arrival_time;
      const waitingTime = turnaroundTime - nextProcess.burst_time;
      
      results.push({
        process_id: nextProcess.process_id,
        burst_time: nextProcess.burst_time,
        arrival_time: nextProcess.arrival_time,
        priority: nextProcess.priority,
        completion_time: completionTime,
        turnaround_time: turnaroundTime,
        waiting_time: waitingTime
      });
      
      ganttData.push({
        process_id: nextProcess.process_id,
        start_time: startTime,
        end_time: completionTime,
        arrival_time: nextProcess.arrival_time,
        priority: nextProcess.priority
      });
      
      currentTime = completionTime;
      completedProcesses.add(nextProcess.process_id);
    }
    
    return {
      results: results.sort((a, b) => a.process_id.localeCompare(b.process_id)),
      avg_waiting_time: calculateAverage(results, 'waiting_time'),
      avg_turnaround_time: calculateAverage(results, 'turnaround_time'),
      gantt_data: ganttData
    };
  } 
  else {
    // Preemptive priority scheduling (similar to SRTF but with priority)
    const results = {};
    const ganttData = [];
    
    // Create a copy with arrival times and default priorities
    const processesWithArrival = processes.map(p => ({
      ...p,
      arrival_time: p.arrival_time || 0,
      priority: p.priority !== undefined ? p.priority : 0,
      remaining_time: p.burst_time,
      completion_time: 0
    }));
    
    // Get all arrival times for event-based simulation
    const events = [...new Set(processesWithArrival.map(p => p.arrival_time))].sort((a, b) => a - b);
    
    // Add event at time 0 if no process starts at time 0
    if (!events.includes(0)) {
      events.unshift(0);
    }
    
    let currentTime = 0;
    let currentProcess = null;
    let lastProcessId = null;
    
    // Continue until all processes are completed
    while (processesWithArrival.some(p => p.remaining_time > 0)) {
      // Find available processes at current time
      const time = currentTime; // Store current time in a variable to avoid closure issue
      const availableProcesses = processesWithArrival.filter(p => 
        p.arrival_time <= time && p.remaining_time > 0
      );
      
      if (availableProcesses.length === 0) {
        // No processes available, jump to next arrival time
        const time = currentTime; // Store current time in a variable to avoid closure issue
        const nextArrival = processesWithArrival
          .filter(p => p.arrival_time > time && p.remaining_time > 0)
          .sort((a, b) => a.arrival_time - b.arrival_time)[0];
        
        if (nextArrival) {
          currentTime = nextArrival.arrival_time;
        } else {
          break;
        }
        continue;
      }
      
      // Find the process with highest priority (lowest number)
      currentProcess = availableProcesses.sort((a, b) => {
        if (a.priority !== b.priority) {
          return a.priority - b.priority;
        }
        return a.arrival_time - b.arrival_time;
      })[0];
      
      // Determine the next event time
      const nextEventTime = processesWithArrival
        .filter(p => p.arrival_time > currentTime)
        .sort((a, b) => a.arrival_time - b.arrival_time)[0]?.arrival_time || Infinity;
      
      // Determine how long this process will run
      const runTime = Math.min(currentProcess.remaining_time, nextEventTime - currentTime);
      
      // Create a gantt entry if the process changes
      if (lastProcessId !== currentProcess.process_id) {
        ganttData.push({
          process_id: currentProcess.process_id,
          start_time: currentTime,
          end_time: currentTime + runTime,
          arrival_time: currentProcess.arrival_time,
          priority: currentProcess.priority
        });
      } else {
        // Extend the last gantt entry
        ganttData[ganttData.length - 1].end_time = currentTime + runTime;
      }
      
      // Update process remaining time
      currentProcess.remaining_time -= runTime;
      
      // Update completion time if process is finished
      if (currentProcess.remaining_time === 0) {
        currentProcess.completion_time = currentTime + runTime;
      }
      
      // Update time and last process
      currentTime += runTime;
      lastProcessId = currentProcess.process_id;
    }
    
    // Calculate turnaround and waiting times
    processesWithArrival.forEach(process => {
      const turnaroundTime = process.completion_time - process.arrival_time;
      const waitingTime = turnaroundTime - process.burst_time;
      
      results[process.process_id] = {
        process_id: process.process_id,
        burst_time: process.burst_time,
        arrival_time: process.arrival_time,
        priority: process.priority,
        completion_time: process.completion_time,
        turnaround_time: turnaroundTime,
        waiting_time: waitingTime
      };
    });
    
    const resultArray = Object.values(results);
    
    return {
      results: resultArray.sort((a, b) => a.process_id.localeCompare(b.process_id)),
      avg_waiting_time: calculateAverage(resultArray, 'waiting_time'),
      avg_turnaround_time: calculateAverage(resultArray, 'turnaround_time'),
      gantt_data: ganttData
    };
  }
};

// Round Robin Scheduling
export const roundRobin = (processes, timeQuantum = 2) => {
  const results = {};
  const ganttData = [];
  const queue = [];
  const processesWithInfo = processes.map(p => ({
    ...p,
    arrival_time: p.arrival_time || 0,
    remaining_time: p.burst_time,
    completion_time: 0,
    last_execution: 0
  }));
  
  // Sort processes by arrival time
  processesWithInfo.sort((a, b) => a.arrival_time - b.arrival_time);
  
  let currentTime = 0;
  let completedProcesses = 0;
  
  // Initially, add all processes that arrive at time 0 to the queue
  processesWithInfo.forEach(p => {
    if (p.arrival_time === 0) {
      queue.push(p);
    }
  });
  
  // Continue until all processes are completed
  while (completedProcesses < processes.length) {
    if (queue.length === 0) {
      // Queue is empty but there are still processes to be executed
      // Find the next process to arrive
      const nextArrival = processesWithInfo
        .filter(p => p.arrival_time > currentTime && p.remaining_time > 0)
        .sort((a, b) => a.arrival_time - b.arrival_time)[0];
      
      if (nextArrival) {
        currentTime = nextArrival.arrival_time;
        
        // Add all processes that arrive at this time to the queue
        processesWithInfo.forEach(p => {
          if (p.arrival_time <= currentTime && p.remaining_time > 0 && !queue.includes(p)) {
            queue.push(p);
          }
        });
      } else {
        // No more processes to arrive and queue is empty - we're done
        break;
      }
    }
    
    // Get the next process from the queue
    const currentProcess = queue.shift();
    
    if (!currentProcess) continue;
    
    // Calculate how long this process will execute
    const executeTime = Math.min(timeQuantum, currentProcess.remaining_time);
    
    // Add to gantt chart
    ganttData.push({
      process_id: currentProcess.process_id,
      start_time: currentTime,
      end_time: currentTime + executeTime,
      arrival_time: currentProcess.arrival_time
    });
    
    // Update process
    currentProcess.remaining_time -= executeTime;
    currentProcess.last_execution = currentTime + executeTime;
    
    // Advance time
    currentTime += executeTime;
    
    // Check for new arrivals during this time quantum
    processesWithInfo.forEach(p => {
      if (p.arrival_time > currentTime - executeTime && p.arrival_time <= currentTime && 
          p.remaining_time > 0 && !queue.includes(p) && p !== currentProcess) {
        queue.push(p);
      }
    });
    
    // If the process is complete
    if (currentProcess.remaining_time === 0) {
      completedProcesses++;
      currentProcess.completion_time = currentTime;
      
      // Calculate metrics
      const turnaroundTime = currentProcess.completion_time - currentProcess.arrival_time;
      const waitingTime = turnaroundTime - currentProcess.burst_time;
      
      results[currentProcess.process_id] = {
        process_id: currentProcess.process_id,
        burst_time: currentProcess.burst_time,
        arrival_time: currentProcess.arrival_time,
        completion_time: currentProcess.completion_time,
        turnaround_time: turnaroundTime,
        waiting_time: waitingTime,
        priority: currentProcess.priority
      };
    } else {
      // If the process is not complete, add it back to the queue
      queue.push(currentProcess);
    }
  }
  
  const resultArray = Object.values(results);
  
  return {
    results: resultArray.sort((a, b) => a.process_id.localeCompare(b.process_id)),
    avg_waiting_time: calculateAverage(resultArray, 'waiting_time'),
    avg_turnaround_time: calculateAverage(resultArray, 'turnaround_time'),
    gantt_data: ganttData
  };
}; 

// Function to compare all algorithms and return their results
export const compareAlgorithms = (processes, timeQuantum = 2) => {
  return {
    fcfs: fcfs(processes),
    sjf: sjf(processes),
    srtf: srtf(processes),
    priority: priorityScheduling(processes, false),
    priority_preemptive: priorityScheduling(processes, true),
    round_robin: roundRobin(processes, timeQuantum)
  };
}; 