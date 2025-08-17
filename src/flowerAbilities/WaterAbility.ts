import { FLOWER_STATES } from "../flowers/flowers.js";
import { BaseFlowerAbility } from "./BaseFlowerAbility.js";

export class WaterAbility extends BaseFlowerAbility {
	constructor(config = {}) {
		super()
	}

	onRemove(x, y, gameGrid, plantState) {
	}
	onAdd(x, y, gameGrid, plantState) {
		if (plantState === FLOWER_STATES.BLOOMING) {
			// Water all cells in the same row and column
			const WATER_AMOUNT = 5;

			// Water the row
			for (let i = 0; i < gameGrid[y].length; i++) {
				if (i !== x) { // Skip the Hydroangea's cell
					gameGrid[y][i].water(WATER_AMOUNT);
				}
			}

			// Water the column
			for (let j = 0; j < gameGrid.length; j++) {
				if (j !== y) { // Skip the Hydroangea's cell
					gameGrid[j][x].water(WATER_AMOUNT);
				}
			}
		}
	}

}