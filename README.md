# A* Pathfinding Visualizer

#### Video Demo: https://www.youtube.com/watch?v=8HOlMG2158E
#### Description:

This is a visual and interactive implementation of the **A\*** (A-Star) pathfinding algorithm, built using **React.js** for my final project in **CS50**. The A* algorithm is widely used in navigation systems, games, and AI applications due to its optimal balance between performance and accuracy when finding the shortest path between two points.

This project enables users to place a **start point**, **end point**, and **obstacles** (walls) on a customizable grid. Once configured, the algorithm calculates the optimal path in real time, providing a clear, animated visualization of the process.

---

## Key Features

- 🧭 **Interactive Grid:** Click on grid cells to add or remove obstacles.
- 🚩 **Drag-and-Drop Start & End Points:** Intuitive drag support using `@dnd-kit/core`.
- 🔍 **Real-Time A\* Algorithm Visualization:** Watch how the algorithm explores nodes step-by-step.
- 🔁 **Reset Button:** Clear the board and run new simulations easily.
- 💡 **Custom Heuristics & Distance Functions:** Uses Euclidean distance for cost estimation and calculation.

---

## Technologies Used

- **React.js** for component-based UI
- **JavaScript (ES6+)** for logic
- **@dnd-kit/core** for drag-and-drop support
- **Material UI Icons** for start and goal node visuals
- **CSS** for styling and animation effects

---

## File Breakdown

### `App.jsx`

This is the core of the application. It handles:

- Initializing the grid with a fixed number of cells.
- Managing the state for the start and end nodes.
- Handling drag-and-drop placement of these nodes.
- Running the A\* algorithm and animating the result.
- Managing interactions like adding walls or resetting the grid.

### `utils/heuristics.js`

Defines the **heuristic function** used by A\*. It uses the Euclidean distance between the current cell and the goal to estimate the remaining cost.

```js
function heuristics(x, y, ending)
