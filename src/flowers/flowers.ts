import Lavender from "./Lavender.js";
import Rose from "./Rose.js";
import Sunflower from "./Sunflower.js";
import Hydroangea from "./Hydroangea.js";
import BaseFlower from "./BaseFlower.js";

export enum FLOWER_STATES {
  SEED = 'seed',
  SHOOT = 'shoot',
  FLOWER = 'flower',
  BLOOMING = 'blooming'
};

export enum FLOWER_TYPES {
  LAVENDER = 'lavender',
  ROSE = 'rose',
  SUNFLOWER = 'sunflower',
  HYDROANGEA = 'hydroangea'
}

// Create instances of each flower type
export const FLOWERS: Record<FLOWER_TYPES, BaseFlower> = {
  [FLOWER_TYPES.LAVENDER]: new Lavender(),
  [FLOWER_TYPES.ROSE]: new Rose(),
  [FLOWER_TYPES.SUNFLOWER]: new Sunflower(),
  [FLOWER_TYPES.HYDROANGEA]: new Hydroangea()
}; 