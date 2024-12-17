import Lavender from "./flowers/Lavender.js";
import Rose from "./flowers/Rose.js";
import Sunflower from "./flowers/Sunflower.js";
import Hydroangea from "./flowers/Hydroangea.js";

export const STATES = {
  SEED: 'seed',
  SHOOT: 'shoot',
  FLOWER: 'flower',
  BLOOMING: 'blooming'
};

export const FLOWER_TYPES = {
  LAVENDER: 'lavender',
  ROSE: 'rose',
  SUNFLOWER: 'sunflower',
  HYDROANGEA: 'hydroangea'
}

// Create instances of each flower type
export const FLOWERS = {
  [FLOWER_TYPES.LAVENDER]: new Lavender(),
  [FLOWER_TYPES.ROSE]: new Rose(),
  [FLOWER_TYPES.SUNFLOWER]: new Sunflower(),
  [FLOWER_TYPES.HYDROANGEA]: new Hydroangea()
}; 