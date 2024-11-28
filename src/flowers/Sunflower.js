import BaseFlower from './BaseFlower.js';
import { STATES } from '../flowers.js';

export default class Sunflower extends BaseFlower {
    constructor() {
        super();
        this.hue = 50;
        this.saturation = 90;
        this.tooltip = 'Plant a Sunflower\nFast growing and needs lots of water';
        this.stateConfig = {
            [STATES.SEED]: {
                totalWaterNeeded: 18,
                growthTimeSeconds: 12,
            },
            [STATES.SHOOT]: {
                totalWaterNeeded: 22,
                growthTimeSeconds: 18,
            },
            [STATES.FLOWER]: {
                totalWaterNeeded: 28,
                growthTimeSeconds: 22,
            },
            [STATES.BLOOMING]: {
                totalWaterNeeded: 32,
                growthTimeSeconds: 32,
            }
        };
    }

    onStateChange(oldState, newState) {
        super.onStateChange(oldState, newState);
        switch (newState) {
            case STATES.SHOOT:
                console.log('Sunflower is reaching for the sky!');
                break;
            case STATES.FLOWER:
                console.log('Sunflower head is forming!');
                break;
            case STATES.BLOOMING:
                console.log('Sunflower is tracking the sun!');
                break;
        }
    }

    renderBlooming(ctx, x, y, cellWidth, cellHeight, growth) {
        const brightness = 50 + growth / 4;
        const size = (growth / 100 * 0.7 + 0.3) * Math.min(cellWidth, cellHeight);
        
        ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${brightness}%, 0.3)`;
        this.drawFlowerShape(ctx, x, y, cellWidth, cellHeight, size * 1.2);
        
        ctx.fillStyle = `hsl(${this.hue}, ${this.saturation}%, ${brightness}%)`;
        this.drawFlowerShape(ctx, x, y, cellWidth, cellHeight, size);
    }
}