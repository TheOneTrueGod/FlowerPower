import BaseFlower from './BaseFlower.js';
import { STATES, FLOWER_TYPES } from '../flowers.js';
import PlantEffect, { PLANT_EFFECT_TYPES } from '../PlantEffect.js';
import { getAdjacentCoords } from '../gridUtils.js';

const SUNFLOWER_MIN_LIGHT_LEVEL = 80;

export default class Sunflower extends BaseFlower {
	constructor() {
		super();
		this.type = FLOWER_TYPES.SUNFLOWER;
		this.hue = 50;
		this.saturation = 90;
		this.tooltip = 'Plant a Sunflower\nLights up the night';
		this.stateConfig = {
			[STATES.SEED]: {
				totalWaterNeeded: 5,
				growthTimeSeconds: 3,
				minLightLevel: 0,
			},
			[STATES.SHOOT]: {
				totalWaterNeeded: 5,
				growthTimeSeconds: 3,
				minLightLevel: 0,
			},
			[STATES.FLOWER]: {
				totalWaterNeeded: 10,
				growthTimeSeconds: 10,
				minLightLevel: 50,
			},
			[STATES.BLOOMING]: {
				totalWaterNeeded: 0,
				growthTimeSeconds: 30,
				minLightLevel: 80,
			}
		};
	}

	onRemove(x, y, gameGrid, plantState) {
		if (this.stateConfig[plantState].minLightLevel) {
			// Remove sunlight effect from adjacent tiles
			const adjacentCoords = getAdjacentCoords(x, y, gameGrid);
			adjacentCoords.forEach(([adjX, adjY]) => {
				gameGrid[adjY][adjX].removePlantEffect(x, y);
			});
		}
	}

	onAdd(x, y, gameGrid, plantState) {
		if (this.stateConfig[plantState].minLightLevel) {
			// Add sunlight effect to adjacent tiles
			const adjacentCoords = getAdjacentCoords(x, y, gameGrid);
			adjacentCoords.forEach(([adjX, adjY]) => {
				const effect = new PlantEffect(x, y, PLANT_EFFECT_TYPES.MIN_LIGHT_LEVEL, this.stateConfig[plantState].minLightLevel);
				gameGrid[adjY][adjX].addPlantEffect(effect);
			});
		}
	}

	onStateChange(oldState, newState, x, y, gameGrid) {
		super.onStateChange(oldState, newState, x, y, gameGrid);
		switch (newState) {
			case STATES.SHOOT:
				console.log('Sunflower is reaching for the sky!');
				break;
			case STATES.FLOWER:
				console.log('Sunflower head is forming!');
				break;
			case STATES.BLOOMING:
				console.log('Sunflower is tracking the sun!');
				break;
		}
	}

	renderBlooming(ctx, x, y, cellWidth, cellHeight, growth) {
		const brightness = 50 + growth / 4;
		const size = (0.8 - growth / 100 * 0.4) * Math.min(cellWidth, cellHeight);

		ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${brightness}%, 0.3)`;
		this.drawFlowerShape(ctx, x, y, cellWidth, cellHeight, size * 1.2);

		ctx.fillStyle = `hsl(${this.hue}, ${this.saturation}%, ${brightness}%)`;
		this.drawFlowerShape(ctx, x, y, cellWidth, cellHeight, size);
	}
}