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
        totalWaterNeeded: 2,
        growthTimeHours: 1, // 1 hour to grow from seed to shoot
      },
      [STATES.SHOOT]: {
        totalWaterNeeded: 2,
        growthTimeHours: 1, // 1 hour to grow from shoot to flower
      },
      [STATES.FLOWER]: {
        totalWaterNeeded: 2,
        growthTimeHours: 1, // 1 hour to grow from flower to blooming
      },
      [STATES.BLOOMING]: {
        totalWaterNeeded: 2,
        growthTimeHours: 4, // 4 hours to bloom before expiring
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