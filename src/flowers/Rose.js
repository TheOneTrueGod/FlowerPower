import { STATES } from "../flowers.js";
import BaseFlower from "./BaseFlower.js";

export default class Rose extends BaseFlower {
  constructor() {
    super();
    this.hue = 0;
    this.saturation = 90;
    this.tooltip = 'Plant a Rose\nSlow to grow but very hardy once established';
    this.stateConfig = {
      [STATES.SEED]: {
        totalWaterNeeded: 20,
        growthTimeSeconds: 15,
      },
      [STATES.SHOOT]: {
        totalWaterNeeded: 25,
        growthTimeSeconds: 20,
      },
      [STATES.FLOWER]: {
        totalWaterNeeded: 30,
        growthTimeSeconds: 25,
      },
      [STATES.BLOOMING]: {
        totalWaterNeeded: 35,
        growthTimeSeconds: 35,
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