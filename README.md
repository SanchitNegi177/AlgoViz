# OS Scheduler Visualizer

An interactive web application for visualizing CPU and Disk scheduling algorithms. This educational tool helps users understand how different scheduling algorithms work through animated visualizations.

## Features

### CPU Scheduler
- Interactive visualizations of CPU scheduling algorithms
- Supported algorithms include:
  - First-Come, First-Served (FCFS)
  - Shortest Job First (SJF)
  - Priority Scheduling
  - Round Robin
- Real-time view of the ready queue
- Ability to compare different algorithms side by side

### Disk Scheduler
- Visual representations of disk scheduling algorithms
- Explore how different algorithms optimize read/write operations
- Compare performance metrics across algorithms

## Technology Stack

- React.js with TypeScript
- Material UI for styling and components
- React Router for navigation
- Chart.js and Recharts for data visualization

## Installation

1. Clone this repository
```
git clone https://github.com/SanchitNegi177/AlgoViz.git
cd OS-Scheduler
```

2. Install dependencies
```
npm install
```

3. Start the development server
```
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Navigate to either the CPU Scheduler or Disk Scheduler section from the home page
2. Select an algorithm to visualize
3. Configure the parameters (processes, arrival times, burst times, etc.)
4. Run the visualization and observe the scheduling in action
5. View performance metrics and compare with other algorithms

## Project Structure

```
src/
├── components/
│   ├── CPUScheduler/     # CPU Scheduler implementation
│   └── DiskScheduler/    # Disk Scheduler implementation
├── App.js                # Main application component
└── index.js              # Entry point
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Created for educational purposes
- Inspired by operating system scheduling concepts 
