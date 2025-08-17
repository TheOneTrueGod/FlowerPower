import BaseFlower from './BaseFlower.js';
import { STATES, FLOWER_TYPES } from '../flowers.js';
import { WaterAbility } from '../flowerAbilities/WaterAbility.js';

export default class Hydroangea extends BaseFlower {
    constructor() {
        super([new WaterAbility()]);
        this.type = FLOWER_TYPES.HYDROANGEA;
        this.hue = 200;  // Blue-ish color
        this.saturation = 70;
        this.tooltip = 'Plant a Hydroangea\nWhile blooming, automatically waters all cells in its column.';
        this.stateConfig = {
            [STATES.SEED]: {
                totalWaterNeeded: 4,
                growthTimeHours: 2, // 2 hours to grow from seed to shoot
            },
            [STATES.SHOOT]: {
                totalWaterNeeded: 4,
                growthTimeHours: 3, // 3 hours to grow from shoot to flower
            },
            [STATES.FLOWER]: {
                totalWaterNeeded: 4,
                growthTimeHours: 3, // 3 hours to grow from flower to blooming
            },
            [STATES.BLOOMING]: {
                totalWaterNeeded: 4,
                growthTimeHours: 6, // 6 hours to bloom before expiring
            }
        };
    }

    renderBlooming(ctx, x, y, cellWidth, cellHeight, growth) {
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