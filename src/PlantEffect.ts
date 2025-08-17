export const PLANT_EFFECT_TYPES = {
  MIN_LIGHT_LEVEL: 'min_light_level',
  POLLINATED: 'pollinated',
}

export default class PlantEffect {
  sourceX: number;
  sourceY: number;
  effectType: string;
  effectValue: number;

  constructor(sourceX: number, sourceY: number, effectType: string, effectValue: number) {
    this.sourceX = sourceX;
    this.sourceY = sourceY;
    this.effectType = effectType;
    this.effectValue = effectValue;
  }
}