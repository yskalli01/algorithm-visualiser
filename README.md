# Realtime Algorithm Visualizer

An interactive algorithm visualizer built with **Next.js**, **React**, **TypeScript**, and **Material UI**. The project demonstrates how different algorithms work through real-time animations, interactive controls, and clean visual feedback.

## Features

### Sorting Algorithms

Visualize sorting algorithms step by step using animated bars and real-time state changes.

- Bubble Sort
- Selection Sort
- Insertion Sort
- Merge Sort
- Quick Sort
- Heap Sort

### Pathfinding Algorithms

Explore how pathfinding algorithms search through a grid and find routes between nodes.

- Dijkstra's Algorithm
- A* Search
- Breadth-First Search (BFS)
- Depth-First Search (DFS)

### Backtracking Algorithms

Understand recursive problem-solving through interactive visual demonstrations.

- Sudoku Solver
- N-Queens
- Maze Solver

## Tech Stack

- **Next.js**
- **React**
- **TypeScript**
- **Material UI (MUI)**
- **Framer Motion**

## Getting Started

### Prerequisites

Make sure you have Node.js and npm installed.

```bash
node -v
npm -v
```

### Installation

Clone the repository:

```bash
git clone https://github.com/yskalli01/algorithm-visualiser.git
```

Navigate into the project folder:

```bash
cd realtime-algorithm-visualizer
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the app in your browser:

```txt
http://localhost:3000
```

## Available Scripts

```bash
npm run dev
```

Runs the development server.

```bash
npm run build
```

Builds the project for production.

```bash
npm run start
```

Starts the production server.

```bash
npm run lint
```

Runs linting checks.

## Project Structure

```txt
src/
├── components/
│   ├── visualizers/
│   │   ├── sorting/
│   │   ├── pathfinding/
│   │   └── backtracking/
│   └── ui/
├── lib/
│   ├── algorithms/
│   │   ├── sorting/
│   │   ├── pathfinding/
│   │   └── backtracking/
├── theme/
├── types/
└── pages/
```

## Visualizer Controls

Each visualizer includes controls for interacting with the algorithm execution:

- Algorithm selection
- Play and pause
- Reset
- Speed adjustment
- Step-by-step visualization
- Dynamic visual updates

## Purpose

The goal of this project is to make algorithms easier to understand by showing how they behave visually. Instead of only reading code or theory, users can interact with each algorithm and observe how data changes at every step.

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a new branch:

```bash
git checkout -b feature/your-feature-name
```

3. Commit your changes:

```bash
git commit -m "Add your feature"
```

4. Push to your branch:

```bash
git push origin feature/your-feature-name
```

5. Open a pull request


## Author

Built with Next.js, React, TypeScript, and Material UI.
