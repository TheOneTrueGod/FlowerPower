import { FLOWER_STATES, FLOWER_TYPES } from "./flowers.js";
import BaseFlower from "./BaseFlower.js";
import PlantEffect, { PLANT_EFFECT_TYPES } from '../PlantEffect.js';
import { getAdjacentCoords } from '../gridUtils.js';
import { GameGrid } from "../gameGrid/types.js";

export default class Lavender extends BaseFlower {
  type: FLOWER_TYPES;
  constructor() {
    super();
    this.type = FLOWER_TYPES.LAVENDER;
    this.hue = 340;
    this.saturation = 80;
    this.tooltip = 'Plant Lavender\nAttracts pollinators which replant seeds when they finish blooming';
    this.stateConfig = {
      [FLOWER_STATES.SEED]: {
        totalWaterNeeded: 1,
        growthTimeSeconds: 2,
      },
      [FLOWER_STATES.SHOOT]: {
        totalWaterNeeded: 1,
        growthTimeSeconds: 2,
      },
      [FLOWER_STATES.FLOWER]: {
        totalWaterNeeded: 1,
        growthTimeSeconds: 2,
      },
      [FLOWER_STATES.BLOOMING]: {
        totalWaterNeeded: 1,
        growthTimeSeconds: 30,
      }
    };
  }

  onRemove(x: number, y: number, gameGrid: GameGrid, plantState: string) {
    if (plantState === FLOWER_STATES.BLOOMING) {
      // Remove pollination effect from adjacent tiles
      const adjacentCoords = getAdjacentCoords(x, y, gameGrid);
      adjacentCoords.forEach(([adjX, adjY]) => {
        gameGrid[adjY][adjX].removePlantEffect(x, y);
      });
    }
  }

  onAdd(x: number, y: number, gameGrid: GameGrid, plantState: string) {
    if (plantState === FLOWER_STATES.BLOOMING) {
      // Add pollination effect to adjacent tiles
      const adjacentCoords = getAdjacentCoords(x, y, gameGrid);
      adjacentCoords.forEach(([adjX, adjY]) => {
        const effect = new PlantEffect(x, y, PLANT_EFFECT_TYPES.POLLINATED, 1);
        gameGrid[adjY][adjX].addPlantEffect(effect);
      });
    }
  }

  onStateChange(oldState: FLOWER_STATES, newState: FLOWER_STATES, x: number, y: number, gameGrid: GameGrid) {
    super.onStateChange(oldState, newState, x, y, gameGrid);

    switch (newState) {
      case FLOWER_STATES.SHOOT:
        console.log('Lavender sprouted!');
        break;
      case FLOWER_STATES.FLOWER:
        console.log('Lavender formed its first bud!');
        break;
      case FLOWER_STATES.BLOOMING:
        console.log('Lavender is in full bloom!');
        break;
    }
  }
}