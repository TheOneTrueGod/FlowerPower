import { FLOWER_STATES, FLOWER_TYPES } from "./flowers.js";
import BaseFlower from "./BaseFlower.js";
import { GameGrid } from "../gameGrid/types.js";

export default class Rose extends BaseFlower {
  type: FLOWER_TYPES;
  constructor() {
    super();
    this.type = FLOWER_TYPES.ROSE;
    this.hue = 0;
    this.saturation = 90;
    this.tooltip = 'Plant a Rose\nSlow to grow but very hardy once established';
    this.stateConfig = {
      [FLOWER_STATES.SEED]: {
        totalWaterNeeded: 1,
        growthTimeHours: 1,
      },
      [FLOWER_STATES.SHOOT]: {
        totalWaterNeeded: 1,
        growthTimeHours: 1,
      },
      [FLOWER_STATES.FLOWER]: {
        totalWaterNeeded: 1,
        growthTimeHours: 1,
      },
      [FLOWER_STATES.BLOOMING]: {
        totalWaterNeeded: 1,
        growthTimeHours: 4,
      }
    };
  }

  onStateChange(oldState: FLOWER_STATES, newState: FLOWER_STATES, x: number, y: number, gameGrid: GameGrid) {
    super.onStateChange(oldState, newState, x, y, gameGrid);
    switch (newState) {
      case FLOWER_STATES.SHOOT:
        console.log('Rose shoot has emerged!');
        break;
      case FLOWER_STATES.FLOWER:
        console.log('Rose bud is forming!');
        break;
      case FLOWER_STATES.BLOOMING:
        console.log('Rose has opened its petals!');
        break;
    }
  }
}