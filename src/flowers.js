import Daisy from "./flowers/Daisy.js";
import Rose from "./flowers/Rose.js";
import Sunflower from "./flowers/Sunflower.js";
import Hydroangea from "./flowers/Hydroangea.js";

export const STATES = {
  SEED: 'seed',
  SHOOT: 'shoot',
  FLOWER: 'flower',
  BLOOMING: 'blooming'
};

// Create instances of each flower type
export const FLOWERS = {
  daisy: new Daisy(),
  rose: new Rose(),
  sunflower: new Sunflower(),
  hydroangea: new Hydroangea()
}; 