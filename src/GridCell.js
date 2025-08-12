import { GRID_WIDTH } from './constants.js';
import { FLOWERS } from './flowers.js';
import { PLANT_EFFECT_TYPES } from './PlantEffect.js';

const DEBUG_SHOW_SUNLIGHT = false;

export default class GridCell {
	static MAX_WATER_LEVEL() { return 20 };
  constructor(waterLevel = 0) {
    this.waterLevel = waterLevel;
    this.sunlight = 0;
    this.plant = null;
    this.plantEffects = []
  }

  gameTick(deltaTime, x, y, gameGrid, timeManager) {
    const minLightLevel = this.plantEffects.reduce((acc, effect) => {
      if (effect.effectType === PLANT_EFFECT_TYPES.MIN_LIGHT_LEVEL) {
        return Math.max(effect.effectValue, acc)
      }
      return acc
    }, 0);

    this.sunlight = Math.max(minLightLevel, timeManager.getLightLevelForColumn(x, GRID_WIDTH));
    if (this.hasPlant()) {
      const flowerDef = FLOWERS[this.plant.type];
      if (flowerDef) {
        const waterConsumed = flowerDef.update(this.plant, this.waterLevel, this.sunlight, deltaTime);
        this.waterLevel = Math.max(0, this.waterLevel - waterConsumed);

        if (this.plant.stateJustChanged) {
          flowerDef.onStateChange(this.plant.previousState, this.plant.state, x, y, gameGrid)
          delete this.plant.stateJustChanged;
          delete this.plant.previousState;
        }

        // Check if the plant should be removed
        if (this.plant.shouldBeRemoved) {
          const plant = this.plant
          flowerDef.onRemove(x, y, gameGrid, plant.state)
          this.plant = null;
          flowerDef.onExpire(x, y, gameGrid, plant.state);
        }
      }
    }
  }

  addPlantEffect(effect) {
    this.plantEffects.push(effect);
  }

  removePlantEffect(sourceX, sourceY) {
    this.plantEffects = this.plantEffects.filter(e => e.sourceX !== sourceX || e.sourceY !== sourceY);
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
    this.waterLevel = Math.min(this.waterLevel + amount, GridCell.MAX_WATER_LEVEL());
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
      ctx.fillStyle = `rgba(0, 0, 255, ${this.waterLevel / GridCell.MAX_WATER_LEVEL() / 4 + 0.1})`;
      const waterLevelHeight = height * 0.3 * this.waterLevel / GridCell.MAX_WATER_LEVEL();
      ctx.fillRect(x * width, y * height + (height - waterLevelHeight), width, waterLevelHeight);
    }

    // Draw plant if exists
    if (this.hasPlant()) {
      const flowerDef = FLOWERS[this.plant.type];
      if (flowerDef) {
        flowerDef.render(ctx, x, y, width, height, this.plant);
      }
    }

    if (this.sunlight < 100) {
      const opacity = 0.4 * (1 - this.sunlight / 100);
      ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
      ctx.fillRect(x * width, y * height, width, height);
    }

    if (DEBUG_SHOW_SUNLIGHT) {
      // Draw sunlight level text
      ctx.fillStyle = 'white';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(Math.round(this.sunlight), x * width + width / 2, y * height + height / 2);
    }
  }
}