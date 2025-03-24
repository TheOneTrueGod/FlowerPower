import { GRID_WIDTH } from '../constants.js';
import { FLOWER_STATES, FLOWER_TYPES, FLOWERS } from '../flowers/flowers.js';
import { TimeManager } from '../managers/TimeManager.js';
import PlantEffect, { PLANT_EFFECT_TYPES } from '../PlantEffect.js';
import { GameGrid } from './types.js';

const MAX_WATER_LEVEL = 20;
const DEBUG_SHOW_SUNLIGHT = false;

export type CellPlant = {
  type: FLOWER_TYPES;
  state: FLOWER_STATES;
  growth: number;
  stateJustChanged?: boolean;
  previousState?: FLOWER_STATES;
  shouldBeRemoved?: boolean;
}

export default class GridCell {
  waterLevel: number;
  sunlight: number;
  plant: CellPlant | null;
  plantEffects: PlantEffect[];

  constructor() {
    this.waterLevel = 0;
    this.sunlight = 0;
    this.plant = null;
    this.plantEffects = []
  }

  gameTick(deltaTime: number, x: number, y: number, gameGrid: GameGrid, timeManager: TimeManager) {
    const minLightLevel = this.plantEffects.reduce((acc, effect) => {
      if (effect.effectType === PLANT_EFFECT_TYPES.MIN_LIGHT_LEVEL) {
        return Math.max(effect.effectValue, acc)
      }
      return acc
    }, 0);

    this.sunlight = Math.max(minLightLevel, timeManager.getLightLevelForColumn(x, GRID_WIDTH));
    if (this.plant !== null) {
      const flowerDef = FLOWERS[this.plant.type];
      if (flowerDef) {
        const waterConsumed = flowerDef.update(this.plant, this.waterLevel, this.sunlight, deltaTime);
        this.waterLevel = Math.max(0, this.waterLevel - waterConsumed);

        if (this.plant && this.plant.stateJustChanged) {
          if (!this.plant.previousState) {
            throw new Error("previousState not set when stateJustChanged was")
          }
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

  addPlantEffect(effect: PlantEffect) {
    this.plantEffects.push(effect);
  }

  removePlantEffect(sourceX: number, sourceY: number) {
    this.plantEffects = this.plantEffects.filter(e => e.sourceX !== sourceX || e.sourceY !== sourceY);
  }

  hasPlant() {
    return this.plant !== null;
  }

  plantFlower(type: FLOWER_TYPES) {
    if (!this.hasPlant()) {
      this.plant = {
        type: type,
        state: FLOWER_STATES.SEED,
        growth: 0,
      };
    }
  }

  water(amount: number) {
    this.waterLevel = Math.min(this.waterLevel + amount, MAX_WATER_LEVEL);
  }

  render(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
    // Draw soil background
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x * width, y * height, width, height);

    // Draw grid lines
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.strokeRect(x * width, y * height, width, height);

    // Show water level indicator if needed
    if (this.waterLevel > 0) {
      ctx.fillStyle = `rgba(0, 0, 255, ${this.waterLevel / MAX_WATER_LEVEL / 4 + 0.1})`;
      const waterLevelHeight = height * 0.3 * this.waterLevel / MAX_WATER_LEVEL;
      ctx.fillRect(x * width, y * height + (height - waterLevelHeight), width, waterLevelHeight);
    }

    // Draw plant if exists
    if (this.plant !== null) {
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
      ctx.fillText(Math.round(this.sunlight).toString(), x * width + width / 2, y * height + height / 2);
    }
  }
}