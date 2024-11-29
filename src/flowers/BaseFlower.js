import { STATES } from "../flowers.js";

function getGrowthThisTickAndWaterUsedThisTick(waterLevel, waterNeeded, growthTimeMilliseconds, sunlight, deltaTime) {

  const growthRateModifier = sunlight / 100

  if (waterNeeded === 0) {
    return { waterUsedThisTick: 0, growthThisTick: deltaTime / growthTimeMilliseconds * 100 * growthRateModifier };
  }
  const waterUsedThisTick = Math.min(waterLevel, waterNeeded / growthTimeMilliseconds * deltaTime * growthRateModifier);
  const growthThisTick = waterUsedThisTick / waterNeeded * 100;
  return { waterUsedThisTick, growthThisTick };
}

export default class BaseFlower {
  constructor() {
    this.name = this.constructor.name;
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
    this.hue = 0;
    this.saturation = 80;
    this.tooltip = 'A basic flower';
  }

  onStateChange(oldState, newState, x, y, gameGrid) {
    console.log(`${this.name} progressed from ${oldState} to ${newState}`);
    this.onRemove(x, y, gameGrid, oldState);
    this.onAdd(x, y, gameGrid, newState);
  }

  onRemove(x, y, gameGrid, plantState) {}
  onAdd(x, y, gameGrid, plantState) {}

  renderSeed(ctx, x, y, cellWidth, cellHeight, growth) {
    const brightness = 30 + growth / 4;
    const size = (growth / 100 * 0.1 + 0.2) * Math.min(cellWidth, cellHeight);
    ctx.fillStyle = `hsl(30, 20%, ${brightness}%)`; // Brown color for seed
    this.drawFlowerShape(ctx, x, y, cellWidth, cellHeight, size);
  }

  renderShoot(ctx, x, y, cellWidth, cellHeight, growth) {
    const brightness = 40 + growth / 4;
    const size = (growth / 100 * 0.2 + 0.3) * Math.min(cellWidth, cellHeight);
    ctx.fillStyle = `hsl(120, 70%, ${brightness}%)`; // Green color for shoot
    this.drawFlowerShape(ctx, x, y, cellWidth, cellHeight, size);
  }

  renderFlower(ctx, x, y, cellWidth, cellHeight, growth) {
    const brightness = 50 + growth / 4;
    const size = (growth / 100 * 0.3 + 0.5) * Math.min(cellWidth, cellHeight);
    ctx.fillStyle = `hsl(${this.hue}, ${this.saturation}%, ${brightness}%)`;
    this.drawFlowerShape(ctx, x, y, cellWidth, cellHeight, size);
  }

  renderBlooming(ctx, x, y, cellWidth, cellHeight, growth) {
    const brightness = 60 + growth / 4;
    const size = (growth / 100 * 0.1 + 0.8) * Math.min(cellWidth, cellHeight);
    ctx.fillStyle = `hsl(${this.hue}, ${this.saturation}%, ${brightness}%)`;
    this.drawFlowerShape(ctx, x, y, cellWidth, cellHeight, size);
  }

  // Helper method to draw the basic flower shape
  drawFlowerShape(ctx, x, y, cellWidth, cellHeight, size) {
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

  render(ctx, x, y, cellWidth, cellHeight, plant) {
    const { state, growth } = plant;

    switch (state) {
      case STATES.SEED:
        this.renderSeed(ctx, x, y, cellWidth, cellHeight, growth);
        break;
      case STATES.SHOOT:
        this.renderShoot(ctx, x, y, cellWidth, cellHeight, growth);
        break;
      case STATES.FLOWER:
        this.renderFlower(ctx, x, y, cellWidth, cellHeight, growth);
        break;
      case STATES.BLOOMING:
        this.renderBlooming(ctx, x, y, cellWidth, cellHeight, growth);
        break;
    }
  }

  update(plant, waterLevel, sunlight, deltaTime) {
    if (waterLevel > 0) {
      const currentStateConfig = this.stateConfig[plant.state];
      const waterNeeded = currentStateConfig.totalWaterNeeded;
      const growthTimeMilliseconds = currentStateConfig.growthTimeSeconds * 1000;

      const { waterUsedThisTick, growthThisTick } = getGrowthThisTickAndWaterUsedThisTick(waterLevel, waterNeeded, growthTimeMilliseconds, sunlight, deltaTime);

      plant.growth += growthThisTick;

      if (plant.growth >= 100) {
        const states = Object.values(STATES);
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
    return 0;
  }
}