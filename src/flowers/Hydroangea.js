import BaseFlower from './BaseFlower.js';
import { STATES } from '../flowers.js';

export default class Hydroangea extends BaseFlower {
    constructor() {
        super();
        this.hue = 200;  // Blue-ish color
        this.saturation = 70;
        this.tooltip = 'Plant a Hydroangea\nPulls water from nearby cells on each growth stage.\nWhile blooming, automatically waters all cells in its column.';
        this.stateConfig = {
            [STATES.SEED]: {
                totalWaterNeeded: 10,
                growthTimeSeconds: 2.0,
            },
            [STATES.SHOOT]: {
                totalWaterNeeded: 10,
                growthTimeSeconds: 5.0,
            },
            [STATES.FLOWER]: {
                totalWaterNeeded: 10,
                growthTimeSeconds: 5,
            },
            [STATES.BLOOMING]: {
                totalWaterNeeded: 0,
                growthTimeSeconds: 20,
            }
        };
    }

    onStateChange(oldState, newState, x, y, gameGrid) {
        super.onStateChange(oldState, newState, x, y, gameGrid);

        if (newState === STATES.SHOOT) {
            // Pull water from adjacent cells
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
                    const adjacentCell = gameGrid[newY][newX];
                    // Pull 2 units of water from each adjacent cell
                    const waterToPull = Math.min(2, adjacentCell.waterLevel);
                    if (waterToPull > 0) {
                        adjacentCell.waterLevel -= waterToPull;
                        gameGrid[y][x].waterLevel += waterToPull;
                    }
                }
            });
        } else if (newState === STATES.BLOOMING) {
            // Water all cells in the same row and column
            const WATER_AMOUNT = 5;

            // Water the row
            for (let i = 0; i < gameGrid[y].length; i++) {
                if (i !== x) { // Skip the Hydroangea's cell
                    gameGrid[y][i].water(WATER_AMOUNT);
                }
            }

            // Water the column
            for (let j = 0; j < gameGrid.length; j++) {
                if (j !== y) { // Skip the Hydroangea's cell
                    gameGrid[j][x].water(WATER_AMOUNT);
                }
            }
        }

        switch (newState) {
            case STATES.SHOOT:
                console.log('Hydroangea shoots emerge, pulling water from nearby!');
                break;
            case STATES.FLOWER:
                console.log('Hydroangea buds are forming!');
                break;
            case STATES.BLOOMING:
                console.log('Hydroangea blooms in brilliant blue, sharing water with its row and column!');
                break;
        }
    }

    renderBlooming(ctx, x, y, cellWidth, cellHeight, growth) {
        // Add a watery effect for blooming hydroangeas
        const brightness = 50 + growth / 4;
        const size = (growth / 100 * 0.7 + 0.3) * Math.min(cellWidth, cellHeight);
        // Draw water ripple effect
        ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${brightness}%, 0.2)`;
        this.drawFlowerShape(ctx, x, y, cellWidth, cellHeight, size * 1);
        ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${brightness}%, 0.3)`;
        this.drawFlowerShape(ctx, x, y, cellWidth, cellHeight, size * 0.8);

        // Draw main flower
        ctx.fillStyle = `hsl(${this.hue}, ${this.saturation}%, ${brightness}%)`;
        this.drawFlowerShape(ctx, x, y, cellWidth, cellHeight, size * 0.7);
    }
}