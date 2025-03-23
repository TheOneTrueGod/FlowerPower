import { FLOWER_TYPES, FLOWERS } from './flowers/flowers.js';
import GridCell from './gameGrid/GridCell.js';

export enum TOOLS {
  WATERING_CAN = 'wateringCan',
  LAVENDER = 'lavender',
  ROSE = 'rose',
  SUNFLOWER = 'sunflower',
  HYDROANGEA = 'hydroangea'
}

export const TOOL_TOOLTIPS = {
  wateringCan: 'Water plants\nWaters the selected cell and its neighbors'
};

const WATER_AMOUNT = 10;
const ADJACENT_WATER_MULTIPLIER = 0.5;

export class ToolManager {
  selectedTool: TOOLS | null
  constructor() {
    this.selectedTool = null;
    this.initializeTools();
  }

  initializeTools() {
    // Add selected styling and tooltips
    const buttons = document.querySelectorAll('.tool-button');
    debugger
    buttons.forEach(button => {
      // Set tooltip from appropriate source
      if (button.id === 'wateringCan') {
        button.setAttribute('data-tooltip', TOOL_TOOLTIPS.wateringCan);
      } else {
        const flowerType = button.id.replace('Button', '') as FLOWER_TYPES;
        if (!Object.values(FLOWER_TYPES).includes(flowerType)) {
          throw new Error("Invalid flower type from button");
        }
        if (FLOWERS[flowerType]) {
          button.setAttribute('data-tooltip', FLOWERS[flowerType].tooltip);
        }
      }

      button.addEventListener('click', () => {
        // Remove selected class from all buttons
        buttons.forEach(b => b.classList.remove('selected'));
        // Add selected class to clicked button
        button.classList.add('selected');
        // Update selected tool
        const toolId = button.id.replace('Button', '') as TOOLS;
        if (!Object.values(TOOLS).includes(toolId)) {
          throw new Error("Invalid tool type from button");
        }
        this.selectedTool = toolId;
      });
    });
  }

  getSelectedTool() {
    return this.selectedTool;
  }

  // New method to handle tool usage
  useTool(cell: GridCell, toolId: TOOLS, x: number, y: number, gameGrid: GridCell[][]) {
    switch (toolId) {
      case 'wateringCan':
        // Water the clicked cell
        cell.water(WATER_AMOUNT);

        // Water adjacent cells
        const adjacentCells = [
          [-1, -1], [-1, 0], [-1, 1],
          [0, -1], [0, 1],
          [1, -1], [1, 0], [1, 1]
        ];

        adjacentCells.forEach(([dx, dy]) => {
          const newX = x + dx;
          const newY = y + dy;

          // Check if the adjacent cell is within the grid
          if (gameGrid[newY] && gameGrid[newY][newX]) {
            gameGrid[newY][newX].water(WATER_AMOUNT * ADJACENT_WATER_MULTIPLIER);
          }
        });
        break;

      case TOOLS.LAVENDER:
        if (!cell.hasPlant()) {
          cell.plantFlower(FLOWER_TYPES.LAVENDER);
        }
        break;
      case TOOLS.ROSE:
        if (!cell.hasPlant()) {
          cell.plantFlower(FLOWER_TYPES.ROSE);
        }
        break;
      case TOOLS.SUNFLOWER:
        if (!cell.hasPlant()) {
          cell.plantFlower(FLOWER_TYPES.SUNFLOWER);
        }
        break;
      case TOOLS.HYDROANGEA:
        if (!cell.hasPlant()) {
          cell.plantFlower(FLOWER_TYPES.HYDROANGEA);
        }
        break;
    }
  }
}
