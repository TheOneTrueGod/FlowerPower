export const PLANT_EFFECT_TYPES = {
  MIN_LIGHT_LEVEL: 'min_light_level',
  POLLINATED: 'pollinated',
}

export default class PlantEffect {
  constructor(sourceX, sourceY, effectType, effectValue) {
    this.sourceX = sourceX;
    this.sourceY = sourceY;
    this.effectType = effectType;
    this.effectValue = effectValue;
  }
}