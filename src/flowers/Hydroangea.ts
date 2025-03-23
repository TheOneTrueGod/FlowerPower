import { GameGrid } from '../gameGrid/types.js';
import BaseFlower from './BaseFlower.js';
import { FLOWER_STATES, FLOWER_TYPES } from './flowers.js';

export default class Hydroangea extends BaseFlower {
	type: FLOWER_TYPES;
	constructor() {
		super();
		this.type = FLOWER_TYPES.HYDROANGEA;
		this.hue = 200;  // Blue-ish color
		this.saturation = 70;
		this.tooltip = 'Plant a Hydroangea\nWhile blooming, automatically waters all cells in its column.';
		this.stateConfig = {
			[FLOWER_STATES.SEED]: {
				totalWaterNeeded: 10,
				growthTimeSeconds: 2.0,
			},
			[FLOWER_STATES.SHOOT]: {
				totalWaterNeeded: 10,
				growthTimeSeconds: 5.0,
			},
			[FLOWER_STATES.FLOWER]: {
				totalWaterNeeded: 10,
				growthTimeSeconds: 5,
			},
			[FLOWER_STATES.BLOOMING]: {
				totalWaterNeeded: 0,
				growthTimeSeconds: 20,
			}
		};
	}

	onStateChange(oldState: FLOWER_STATES, newState: FLOWER_STATES, x: number, y: number, gameGrid: GameGrid) {
		super.onStateChange(oldState, newState, x, y, gameGrid);

		if (newState === FLOWER_STATES.BLOOMING) {
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
			case FLOWER_STATES.SHOOT:
				console.log('Hydroangea shoots emerge, pulling water from nearby!');
				break;
			case FLOWER_STATES.FLOWER:
				console.log('Hydroangea buds are forming!');
				break;
			case FLOWER_STATES.BLOOMING:
				console.log('Hydroangea blooms in brilliant blue, sharing water with its row and column!');
				break;
		}
	}

	renderBlooming(ctx: CanvasRenderingContext2D, x: number, y: number, cellWidth: number, cellHeight: number, growth: number) {
		// Add a watery effect for blooming hydroangeas
		const brightness = 50 + growth / 4;
		const size = (0.8 - growth / 100 * 0.4) * Math.min(cellWidth, cellHeight);
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