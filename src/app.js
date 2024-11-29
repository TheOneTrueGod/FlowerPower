import GridCell from './GridCell.js';
import { ToolManager } from './tools.js';
import { FLOWERS, STATES } from './flowers.js';
import { TimeManager } from './TimeManager.js';
import { GRID_HEIGHT, GRID_WIDTH } from './constants.js';

// Initialize the tool manager
const toolManager = new ToolManager();

window.onload = () => {
  // Initialize the game grid
  let gameGrid = [];
  for (let y = 0; y < GRID_HEIGHT; y++) {
    let row = [];
    for (let x = 0; x < GRID_WIDTH; x++) {
      row.push(new GridCell());
    }
    gameGrid.push(row);
  }

  // Get canvas and context
  const canvas = document.getElementById('flowerCanvas');
  const ctx = canvas.getContext('2d');

  // Prevent text selection on double click
  canvas.style.userSelect = 'none';
  canvas.addEventListener('mousedown', (e) => e.preventDefault());

  // Calculate cell size based on canvas dimensions
  const CELL_WIDTH = canvas.width / GRID_WIDTH;
  const CELL_HEIGHT = canvas.height / GRID_HEIGHT;

  // Initialize preview images for the flower buttons
  const daisyPreview = document.getElementById('daisyPreview');
  const rosePreview = document.getElementById('rosePreview');
  const sunflowerPreview = document.getElementById('sunflowerPreview');
  const hydroangeaPreview = document.getElementById('hydroangeaPreview');

  // Set canvas sizes for previews
  [
    ['daisy', daisyPreview],
    ['rose', rosePreview],
    ['sunflower', sunflowerPreview],
    ['hydroangea', hydroangeaPreview]
  ].forEach(([flower, canvas]) => {
    if (canvas) {
      canvas.width = 50;
      canvas.height = 50;

      const ctx = canvas.getContext('2d');
      FLOWERS[flower].render(ctx, 0, 0, canvas.width, canvas.height, {
        type: flower,
        state: STATES.BLOOMING,
        growth: 0,
      });
    }
  });

  // Add click handler
  canvas.addEventListener('click', (event) => {
    // Get click coordinates relative to canvas
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Convert to grid coordinates
    const gridX = Math.floor(x / CELL_WIDTH);
    const gridY = Math.floor(y / CELL_HEIGHT);

    // Make sure click is within bounds
    if (gridX >= 0 && gridX < GRID_WIDTH && gridY >= 0 && gridY < GRID_HEIGHT) {
      const cell = gameGrid[gridY][gridX];
      const selectedTool = toolManager.getSelectedTool();

      if (selectedTool) {
        toolManager.useTool(cell, selectedTool, gridX, gridY, gameGrid);
      }
    }
  });

  const timeManager = new TimeManager();

  // Add game state variables
  let lastTimestamp = 0;
  const FRAME_RATE = 60;
  const FRAME_INTERVAL = 1000 / FRAME_RATE;

  function updateGame(deltaTime) {
    timeManager.update(deltaTime);
    // Update game logic here
    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        const cell = gameGrid[y][x];
        cell.gameTick(deltaTime, x, y, gameGrid, timeManager);
      }
    }
  }

  function gameLoop(timestamp) {
    // Calculate delta time
    const deltaTime = timestamp - lastTimestamp;

    // Only update if enough time has passed
    if (deltaTime >= FRAME_INTERVAL) {
      updateGame(deltaTime);
      renderGrid();
      lastTimestamp = timestamp;
    }

    // Request next frame
    requestAnimationFrame(gameLoop);
  }

  function renderGrid() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Render each cell
    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        gameGrid[y][x].render(ctx, x, y, CELL_WIDTH, CELL_HEIGHT);
      }
    }
  }

  // Start the game loop
  requestAnimationFrame(gameLoop);

  // Remove the single renderGrid() call since it's now in the game loop
}
