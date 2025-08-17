import BaseFlower, { BaseFlowerStateConfig } from './BaseFlower.js';
import { FLOWER_STATES, FLOWER_TYPES } from './flowers.js';
import PlantEffect, { PLANT_EFFECT_TYPES } from '../PlantEffect.js';
import { getAdjacentCoords } from '../gridUtils.js';
import { GameGrid } from '../gameGrid/types.js';
import { TimeManager } from '../managers/TimeManager.js';

const SUNFLOWER_MIN_LIGHT_LEVEL = 80;

type SunflowerStateConfig = { minLightLevel: number }

export default class Sunflower extends BaseFlower {
	type: FLOWER_TYPES;
	stateConfig: Record<FLOWER_STATES, BaseFlowerStateConfig & SunflowerStateConfig>
	constructor() {
		super();
		this.type = FLOWER_TYPES.SUNFLOWER;
		this.hue = 50;
		this.saturation = 90;
		this.tooltip = 'Plant a Sunflower\nLights up the night';
		this.stateConfig = {
			[FLOWER_STATES.SEED]: {
				totalWaterNeeded: 3,
				growthTimeHours: 2, // 2 hours to grow from seed to shoot
				minLightLevel: 0,
			},
			[FLOWER_STATES.SHOOT]: {
				totalWaterNeeded: 3,
				growthTimeHours: 2, // 2 hours to grow from shoot to flower
				minLightLevel: 0,
			},
			[FLOWER_STATES.FLOWER]: {
				totalWaterNeeded: 3,
				growthTimeHours: 3, // 3 hours to grow from flower to blooming
				minLightLevel: 50,
			},
			[FLOWER_STATES.BLOOMING]: {
				totalWaterNeeded: 3,
				growthTimeHours: 8, // 8 hours to bloom before expiring
				minLightLevel: 80,
			}
		};
	}

	onRemove(x: number, y: number, gameGrid: GameGrid, plantState: FLOWER_STATES) {
		if (this.stateConfig[plantState].minLightLevel) {
			// Remove sunlight effect from adjacent tiles
			const adjacentCoords = getAdjacentCoords(x, y, gameGrid);
			adjacentCoords.forEach(([adjX, adjY]) => {
				gameGrid[adjY][adjX].removePlantEffect(x, y);
			});
		}
	}

	onAdd(x: number, y: number, gameGrid: GameGrid, plantState: FLOWER_STATES) {
		if (this.stateConfig[plantState].minLightLevel) {
			// Add sunlight effect to adjacent tiles
			const adjacentCoords = getAdjacentCoords(x, y, gameGrid);
			adjacentCoords.forEach(([adjX, adjY]) => {
				const effect = new PlantEffect(x, y, PLANT_EFFECT_TYPES.MIN_LIGHT_LEVEL, this.stateConfig[plantState].minLightLevel);
				gameGrid[adjY][adjX].addPlantEffect(effect);
			});
		}
	}

	onStateChange(oldState: FLOWER_STATES, newState: FLOWER_STATES, x: number, y: number, gameGrid: GameGrid) {
		super.onStateChange(oldState, newState, x, y, gameGrid);
		switch (newState) {
			case FLOWER_STATES.SHOOT:
				console.log('Sunflower is reaching for the sky!');
				break;
			case FLOWER_STATES.FLOWER:
				console.log('Sunflower head is forming!');
				break;
			case FLOWER_STATES.BLOOMING:
				console.log('Sunflower is tracking the sun!');
				break;
		}
	}

	renderBlooming(timeManager: TimeManager, ctx: CanvasRenderingContext2D, x: number, y: number, cellWidth: number, cellHeight: number, growth: number) {
		const brightness = 50 + growth / 4;
		const size = (0.8 - growth / 100 * 0.4) * Math.min(cellWidth, cellHeight);

		ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${brightness}%, 0.3)`;
		this.drawFlowerShape(ctx, x, y, cellWidth, cellHeight, size * 1.2);

		ctx.fillStyle = `hsl(${this.hue}, ${this.saturation}%, ${brightness}%)`;
		this.drawFlowerShape(ctx, x, y, cellWidth, cellHeight, size);
	}
}