import { FLOWERS } from './flowers.js';

export const TOOLS = {
  WATERING_CAN: 'wateringCan',
  DAISY: 'daisy',
  ROSE: 'rose',
  SUNFLOWER: 'sunflower',
  HYDROANGEA: 'hydroangea'
};

export const TOOL_TOOLTIPS = {
  wateringCan: 'Water plants\nWaters the selected cell and its neighbors'
};

const WATER_AMOUNT = 10;
const ADJACENT_WATER_MULTIPLIER = 0.5;

export class ToolManager {
  constructor() {
    this.selectedTool = null;
    this.initializeTools();
  }

  initializeTools() {
    // Add selected styling and tooltips
    const buttons = document.querySelectorAll('.tool-button');

    buttons.forEach(button => {
      // Set tooltip from appropriate source
      if (button.id === 'wateringCan') {
        button.setAttribute('data-tooltip', TOOL_TOOLTIPS.wateringCan);
      } else {
        const flowerType = button.id.replace('Button', '');
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
        this.selectedTool = button.id;
      });
    });
  }

  getSelectedTool() {
    return this.selectedTool;
  }

  // New method to handle tool usage
  useTool(cell, toolId, x, y, gameGrid) {
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

      case 'daisyButton':
        if (!cell.hasPlant()) {
          cell.plantFlower('daisy');
        }
        break;
      case 'roseButton':
        if (!cell.hasPlant()) {
          cell.plantFlower('rose');
        }
        break;
      case 'sunflowerButton':
        if (!cell.hasPlant()) {
          cell.plantFlower('sunflower');
        }
        break;
      case 'hydroangeaButton':
        if (!cell.hasPlant()) {
          cell.plantFlower('hydroangea');
        }
        break;
    }
  }
}
