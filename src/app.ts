import GridCell from './gameGrid/GridCell.js';
import { ToolManager } from './tools.js';
import { FLOWER_TYPES, FLOWERS, FLOWER_STATES } from './flowers/flowers.js';
import { TimeManager } from './managers/TimeManager.js';
import { GRID_HEIGHT, GRID_WIDTH } from './constants.js';

// Initialize the tool manager
const toolManager = new ToolManager();

window.onload = () => {
  // Initialize the game grid
  let gameGrid: Array<Array<GridCell>> = [];

  for (let y = 0; y < GRID_HEIGHT; y++) {
    let row: Array<GridCell> = [];
    for (let x = 0; x < GRID_WIDTH; x++) {
      const waterLevel = (x === Math.floor(GRID_WIDTH / 2) && y === Math.floor(GRID_HEIGHT / 2)) ? GridCell.MAX_WATER_LEVEL() : 0;
      row.push(new GridCell(waterLevel));
    }
    gameGrid.push(row);
  }
  // Get canvas and context
  const canvas: HTMLCanvasElement | null = document.getElementById('flowerCanvas') as HTMLCanvasElement | null;
  if (!canvas) {
    throw new Error("Couldn't create canvas")
  }
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  // Prevent text selection on double click
  canvas.style.userSelect = 'none';
  canvas.addEventListener('mousedown', (e) => e.preventDefault());

  // Calculate cell size based on canvas dimensions
  const CELL_WIDTH = canvas.width / GRID_WIDTH;
  const CELL_HEIGHT = canvas.height / GRID_HEIGHT;

  // Initialize preview images for the flower buttons
  const lavenderPreview = document.getElementById('lavenderPreview') as HTMLCanvasElement | null;
  const rosePreview = document.getElementById('rosePreview') as HTMLCanvasElement | null;
  const sunflowerPreview = document.getElementById('sunflowerPreview') as HTMLCanvasElement | null;
  const hydroangeaPreview = document.getElementById('hydroangeaPreview') as HTMLCanvasElement | null;


  // Set canvas sizes for previews
  const canvasMap: Array<{ plantType: FLOWER_TYPES, canvas: HTMLCanvasElement | null }> = [
    { plantType: FLOWER_TYPES.LAVENDER, canvas: lavenderPreview },
    { plantType: FLOWER_TYPES.ROSE, canvas: rosePreview },
    { plantType: FLOWER_TYPES.SUNFLOWER, canvas: sunflowerPreview },
    { plantType: FLOWER_TYPES.HYDROANGEA, canvas: hydroangeaPreview }
  ]

  canvasMap.forEach(({ plantType, canvas }) => {
    if (canvas) {
      canvas.width = 50;
      canvas.height = 50;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error("unable to get 2d context")
      }
      FLOWERS[plantType].render(ctx, 0, 0, canvas.width, canvas.height, {
        type: plantType,
        state: FLOWER_STATES.BLOOMING,
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

  function updateGame(deltaTime: number) {
    const lastHour = timeManager.getCurrentGameHour();
    timeManager.update(deltaTime);
    const currentHour = timeManager.getCurrentGameHour();

    // Only update game logic (flowers, etc.) when a new game hour starts
    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        const cell = gameGrid[y][x];
        // Pass 1 hour worth of time (in milliseconds) for consistent growth
        const oneGameHourMs = 1000; // 1 second = 1 game hour
        if (lastHour !== currentHour) {
          cell.gameTick(oneGameHourMs, x, y, gameGrid, timeManager);
        }
        cell.animationTick(oneGameHourMs, x, y, gameGrid, timeManager)
      }
    }
  }

  function gameLoop(timestamp: number) {
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
    if (!canvas) {
      throw new Error("unable to get canvas")
    }
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
