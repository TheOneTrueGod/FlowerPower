import { STATES, FLOWER_TYPES } from "../flowers.js";
import BaseFlower from "./BaseFlower.js";

export default class Rose extends BaseFlower {
  constructor() {
    super();
    this.type = FLOWER_TYPES.ROSE;
    this.hue = 0;
    this.saturation = 90;
    this.tooltip = 'Plant a Rose\nSlow to grow but very hardy once established';
    this.stateConfig = {
      [STATES.SEED]: {
        totalWaterNeeded: 1,
        growthTimeSeconds: 1,
      },
      [STATES.SHOOT]: {
        totalWaterNeeded: 1,
        growthTimeSeconds: 1,
      },
      [STATES.FLOWER]: {
        totalWaterNeeded: 1,
        growthTimeSeconds: 1,
      },
      [STATES.BLOOMING]: {
        totalWaterNeeded: 1,
        growthTimeSeconds: 1,
      }
    };
  }

  onStateChange(oldState, newState, x, y, gameGrid) {
    super.onStateChange(oldState, newState, x, y, gameGrid);
    switch (newState) {
      case STATES.SHOOT:
        console.log('Rose shoot has emerged!');
        break;
      case STATES.FLOWER:
        console.log('Rose bud is forming!');
        break;
      case STATES.BLOOMING:
        console.log('Rose has opened its petals!');
        break;
    }
  }
}