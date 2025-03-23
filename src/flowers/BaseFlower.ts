import { FLOWER_STATES, FLOWER_TYPES } from "./flowers.js";
import { PLANT_EFFECT_TYPES } from "../PlantEffect.js";
import { GameGrid } from "../gameGrid/types.js";
import { CellPlant } from "../gameGrid/GridCell.js";

function getGrowthThisTickAndWaterUsedThisTick(waterLevel: number, waterNeeded: number, growthTimeMilliseconds: number, sunlight: number, deltaTime: number) {

  const growthRateModifier = sunlight / 100

  if (waterNeeded === 0) {
    return { waterUsedThisTick: 0, growthThisTick: deltaTime / growthTimeMilliseconds * 100 * growthRateModifier };
  }
  const waterUsedThisTick = Math.min(waterLevel, waterNeeded / growthTimeMilliseconds * deltaTime * growthRateModifier);
  const growthThisTick = waterUsedThisTick / waterNeeded * 100;
  return { waterUsedThisTick, growthThisTick };
}

export type BaseFlowerStateConfig = { totalWaterNeeded: number; growthTimeSeconds: number; }

export default abstract class BaseFlower {
  hue: number;
  name: string;
  abstract type: FLOWER_TYPES;
  stateConfig: Record<FLOWER_STATES, BaseFlowerStateConfig>
  saturation: number;
  tooltip: string;

  constructor() {
    this.name = this.constructor.name;
    this.stateConfig = {
      [FLOWER_STATES.SEED]: {
        totalWaterNeeded: 15,
        growthTimeSeconds: 10,
      },
      [FLOWER_STATES.SHOOT]: {
        totalWaterNeeded: 20,
        growthTimeSeconds: 15,
      },
      [FLOWER_STATES.FLOWER]: {
        totalWaterNeeded: 25,
        growthTimeSeconds: 20,
      },
      [FLOWER_STATES.BLOOMING]: {
        totalWaterNeeded: 30,
        growthTimeSeconds: 30,
      }
    };
    this.hue = 0;
    this.saturation = 80;
    this.tooltip = 'A basic flower';
  }

  onStateChange(oldState: FLOWER_STATES, newState: FLOWER_STATES, x: number, y: number, gameGrid: GameGrid) {
    console.log(`${this.name} progressed from ${oldState} to ${newState}`);
    this.onRemove(x, y, gameGrid, oldState);
    this.onAdd(x, y, gameGrid, newState);
  }

  onRemove(x: number, y: number, gameGrid: GameGrid, plantState: FLOWER_STATES) { }
  onAdd(x: number, y: number, gameGrid: GameGrid, plantState: FLOWER_STATES) { }

  onExpire(x: number, y: number, gameGrid: GameGrid, plantState: FLOWER_STATES) {
    console.log('onExpire', x, y, gameGrid[y][x], plantState);
    if (gameGrid[y][x].plantEffects.some(effect => effect.effectType === PLANT_EFFECT_TYPES.POLLINATED)) {
      gameGrid[y][x].plantFlower(this.type)
    }
  }

  renderSeed(ctx: CanvasRenderingContext2D, x: any, y: any, cellWidth: number, cellHeight: number, growth: number) {
    const brightness = 30 + growth / 4;
    const size = (growth / 100 * 0.1 + 0.2) * Math.min(cellWidth, cellHeight);
    ctx.fillStyle = `hsl(30, 20%, ${brightness}%)`; // Brown color for seed
    this.drawFlowerShape(ctx, x, y, cellWidth, cellHeight, size);
  }

  renderShoot(ctx: CanvasRenderingContext2D, x: any, y: any, cellWidth: number, cellHeight: number, growth: number) {
    const brightness = 40 + growth / 4;
    const size = (growth / 100 * 0.2 + 0.3) * Math.min(cellWidth, cellHeight);
    ctx.fillStyle = `hsl(120, 70%, ${brightness}%)`; // Green color for shoot
    this.drawFlowerShape(ctx, x, y, cellWidth, cellHeight, size);
  }

  renderFlower(ctx: CanvasRenderingContext2D, x: any, y: any, cellWidth: number, cellHeight: number, growth: number) {
    const brightness = 50 + growth / 4;
    const size = (growth / 100 * 0.3 + 0.5) * Math.min(cellWidth, cellHeight);
    ctx.fillStyle = `hsl(${this.hue}, ${this.saturation}%, ${brightness}%)`;
    this.drawFlowerShape(ctx, x, y, cellWidth, cellHeight, size);
  }

  renderBlooming(ctx: CanvasRenderingContext2D, x: any, y: any, cellWidth: number, cellHeight: number, growth: number) {
    const brightness = 60 + growth / 4;
    const size = (0.8 - growth / 100 * 0.4) * Math.min(cellWidth, cellHeight);

    ctx.fillStyle = `hsl(${this.hue}, ${this.saturation}%, ${brightness}%)`;
    this.drawFlowerShape(ctx, x, y, cellWidth, cellHeight, size);
  }

  // Helper method to draw the basic flower shape
  drawFlowerShape(ctx: CanvasRenderingContext2D, x: any, y: any, cellWidth: number, cellHeight: number, size: number) {
    ctx.beginPath();
    ctx.arc(
      x * cellWidth + cellWidth / 2,
      y * cellHeight + cellHeight / 2,
      size / 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  render(ctx: CanvasRenderingContext2D, x: number, y: number, cellWidth: number, cellHeight: number, plant: CellPlant) {
    const { state, growth } = plant;

    switch (state) {
      case FLOWER_STATES.SEED:
        this.renderSeed(ctx, x, y, cellWidth, cellHeight, growth);
        break;
      case FLOWER_STATES.SHOOT:
        this.renderShoot(ctx, x, y, cellWidth, cellHeight, growth);
        break;
      case FLOWER_STATES.FLOWER:
        this.renderFlower(ctx, x, y, cellWidth, cellHeight, growth);
        break;
      case FLOWER_STATES.BLOOMING:
        this.renderBlooming(ctx, x, y, cellWidth, cellHeight, growth);
        break;
    }
  }

  update(plant: CellPlant, waterLevel: number, sunlight: number, deltaTime: number) {
    const currentStateConfig = this.stateConfig[plant.state];
    const waterNeeded = currentStateConfig.totalWaterNeeded;
    const growthTimeMilliseconds = currentStateConfig.growthTimeSeconds * 1000;

    const { waterUsedThisTick, growthThisTick } = getGrowthThisTickAndWaterUsedThisTick(waterLevel, waterNeeded, growthTimeMilliseconds, sunlight, deltaTime);

    plant.growth += growthThisTick;

    if (plant.growth >= 100) {
      const states = Object.values(FLOWER_STATES);
      const currentIndex = states.indexOf(plant.state);

      if (currentIndex < states.length - 1) {
        const oldState = plant.state;
        plant.state = states[currentIndex + 1];
        plant.growth = 0;

        // Mark that the state just changed and store the previous state
        plant.stateJustChanged = true;
        plant.previousState = oldState;
      } else {
        // Plant has completed its lifecycle
        plant.shouldBeRemoved = true;
      }
    }

    return waterUsedThisTick;
  }
}