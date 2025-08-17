import { STATES, FLOWER_TYPES } from "../flowers.js";
import BaseFlower from "./BaseFlower.js";
import PlantEffect, { PLANT_EFFECT_TYPES } from '../PlantEffect.js';
import { getAdjacentCoords } from '../gridUtils.js';

export default class Lavender extends BaseFlower {
  constructor() {
    super();
    this.type = FLOWER_TYPES.LAVENDER;
    this.hue = 340;
    this.saturation = 80;
    this.tooltip = 'Plant Lavender\nAttracts pollinators which replant seeds when they finish blooming';
    this.stateConfig = {
      [STATES.SEED]: {
        totalWaterNeeded: 1,
        growthTimeHours: 1, // 1 hour to grow from seed to shoot
      },
      [STATES.SHOOT]: {
        totalWaterNeeded: 1,
        growthTimeHours: 1, // 1 hour to grow from shoot to flower
      },
      [STATES.FLOWER]: {
        totalWaterNeeded: 1,
        growthTimeHours: 1, // 1 hour to grow from flower to blooming
      },
      [STATES.BLOOMING]: {
        totalWaterNeeded: 1,
        growthTimeHours: 6, // 6 hours to bloom before expiring
      }
    };
  }

  onRemove(x, y, gameGrid, plantState) {
    if (plantState === STATES.BLOOMING) {
      // Remove pollination effect from adjacent tiles
      const adjacentCoords = getAdjacentCoords(x, y, gameGrid);
      adjacentCoords.forEach(([adjX, adjY]) => {
        gameGrid[adjY][adjX].removePlantEffect(x, y);
      });
    }
  }

  onAdd(x, y, gameGrid, plantState) {
    if (plantState === STATES.BLOOMING) {
      // Add pollination effect to adjacent tiles
      const adjacentCoords = getAdjacentCoords(x, y, gameGrid);
      adjacentCoords.forEach(([adjX, adjY]) => {
        const effect = new PlantEffect(x, y, PLANT_EFFECT_TYPES.POLLINATED, true);
        gameGrid[adjY][adjX].addPlantEffect(effect);
      });
    }
  }
 
  onStateChange(oldState, newState, x, y, gameGrid) {
    super.onStateChange(oldState, newState, x, y, gameGrid);

    switch (newState) {
      case STATES.SHOOT:
        console.log('Lavender sprouted!');
        break;
      case STATES.FLOWER:
        console.log('Lavender formed its first bud!');
        break;
      case STATES.BLOOMING:
        console.log('Lavender is in full bloom!');
        break;
    }
  }
}