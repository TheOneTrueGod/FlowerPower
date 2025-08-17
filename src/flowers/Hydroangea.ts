import { WaterAbility } from '../flowerAbilities/WaterAbility.js';
import { GameGrid } from '../gameGrid/types.js';
import BaseFlower from './BaseFlower.js';
import { FLOWER_STATES, FLOWER_TYPES } from './flowers.js';
import { TimeManager } from '../managers/TimeManager.js';

export default class Hydroangea extends BaseFlower {
  type: FLOWER_TYPES;
  constructor() {
    super([new WaterAbility()]);
    this.type = FLOWER_TYPES.HYDROANGEA;
    this.hue = 200;  // Blue-ish color
    this.saturation = 70;
    this.tooltip = 'Plant a Hydroangea\nWhile blooming, automatically waters all cells in its column.';
    this.stateConfig = {
      [FLOWER_STATES.SEED]: {
        totalWaterNeeded: 10,
        growthTimeHours: 2,
      },
      [FLOWER_STATES.SHOOT]: {
        totalWaterNeeded: 10,
        growthTimeHours: 3,
      },
      [FLOWER_STATES.FLOWER]: {
        totalWaterNeeded: 10,
        growthTimeHours: 3,
      },
      [FLOWER_STATES.BLOOMING]: {
        totalWaterNeeded: 0,
        growthTimeHours: 6,
      }
    };
  }

  renderBlooming(timeManager: TimeManager, ctx: CanvasRenderingContext2D, x: number, y: number, cellWidth: number, cellHeight: number, growth: number) {
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