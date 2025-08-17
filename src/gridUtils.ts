
// Helper function to get adjacent coordinates
export function getAdjacentCoords(x: number, y: number, gameGrid: any[][]): [number, number][] {
	const coords: [number, number][] = [];
	for (let dx = -1; dx <= 1; dx++) {
		for (let dy = -1; dy <= 1; dy++) {
			if (dx === 0 && dy === 0) continue;

			const newX = x + dx;
			const newY = y + dy;

			// Check bounds
			if (newX >= 0 && newX < gameGrid[0].length &&
				newY >= 0 && newY < gameGrid.length) {
				coords.push([newX, newY]);
			}
		}
	}
	return coords;
}