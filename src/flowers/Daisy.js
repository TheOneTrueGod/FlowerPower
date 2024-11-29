import { STATES } from "../flowers.js";
import BaseFlower from "./BaseFlower.js";

export default class Daisy extends BaseFlower {
  constructor() {
    super();
    this.hue = 340;
    this.saturation = 80;
    this.tooltip = 'Plant a Daisy\nGrows quickly but needs regular watering';
    this.stateConfig = {
      [STATES.SEED]: {
        totalWaterNeeded: 15,
        growthTimeSeconds: 10,
      },
      [STATES.SHOOT]: {
        totalWaterNeeded: 20,
        growthTimeSeconds: 15,
      },
      [STATES.FLOWER]: {
        totalWaterNeeded: 25,
        growthTimeSeconds: 20,
      },
      [STATES.BLOOMING]: {
        totalWaterNeeded: 30,
        growthTimeSeconds: 30,
      }
    };
  }

  onStateChange(oldState, newState, x, y, gameGrid) {
    super.onStateChange(oldState, newState, x, y, gameGrid);
    switch (newState) {
      case STATES.SHOOT:
        console.log('Daisy sprouted!');
        break;
      case STATES.FLOWER:
        console.log('Daisy formed its first bud!');
        break;
      case STATES.BLOOMING:
        console.log('Daisy is in full bloom!');
        break;
    }
  }
}