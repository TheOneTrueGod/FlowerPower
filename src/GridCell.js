import { FLOWERS } from './flowers.js';

const MAX_WATER_LEVEL = 20;

export default class GridCell {
  constructor() {
    this.waterLevel = 0;
    this.sunlight = 0;
    this.plant = null;
  }

  gameTick(deltaTime, x, y, gameGrid) {
    if (this.hasPlant()) {
      const flowerDef = FLOWERS[this.plant.type];
      if (flowerDef) {
        const waterConsumed = flowerDef.update(this.plant, this.waterLevel, deltaTime);
        this.waterLevel = Math.max(0, this.waterLevel - waterConsumed);

        if (this.plant.stateJustChanged) {
          flowerDef.onStateChange(this.plant.previousState, this.plant.state, x, y, gameGrid);
          delete this.plant.stateJustChanged;
          delete this.plant.previousState;
        }

        // Check if the plant should be removed
        if (this.plant.shouldBeRemoved) {
          this.plant = null;
        }
      }
    }
  }

  hasPlant() {
    return this.plant !== null;
  }

  plantFlower(type) {
    if (!this.hasPlant()) {
      this.plant = {
        type: type,
        state: 'seed',
        growth: 0,
      };
    }
  }

  water(amount) {
    this.waterLevel = Math.min(this.waterLevel + amount, MAX_WATER_LEVEL);
  }

  render(ctx, x, y, width, height) {
    // Draw soil background
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x * width, y * height, width, height);

    // Draw grid lines
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.strokeRect(x * width, y * height, width, height);

    // Show water level indicator if needed
    if (this.waterLevel > 0) {
      ctx.fillStyle = `rgba(0, 0, 255, ${this.waterLevel / MAX_WATER_LEVEL / 2})`;
      ctx.fillRect(x * width, y * height, width, height);
    }

    // Draw plant if exists
    if (this.hasPlant()) {
      const flowerDef = FLOWERS[this.plant.type];
      if (flowerDef) {
        flowerDef.render(ctx, x, y, width, height, this.plant);
      }
    }
  }
}