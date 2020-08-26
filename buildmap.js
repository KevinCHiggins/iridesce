let basic =[[1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0],
			[0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0],
			[0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
			[0,1,0,0,0,0,0,1,0,1,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			];
export let blocks = wrapMap(basic);
export function wrapMap(voxArr) {
	if (voxArr.length === 0) {
		console.log("Cannot wrap empty array.");
	}
	else if (voxArr[0].length === 0) {
		console.log("Cannot wrap array with empty cols.");
	}

	let newArrSize = voxArr.length + 2;
	let newColSize = voxArr[0].length + 2; // assuming a non-jagged array
	let newArr = [];

	for (let i = 0; i < newArrSize; i++) {
		newArr.push([]); // add an empty column
		for (let j = 0; j < newColSize; j++) {
			// if we're not at the edge of the new array
			if (i > 0 && j > 0 && i < newArrSize - 1 && j < newColSize - 1) {
				newArr[i].push(voxArr[i - 1][j-1]); // put in an el from the old array
			}
			else {
				// otherwise put in a barrier around the edge
				newArr[i].push(2);
			}
			console.log(newArr[i][j])
		}
	}
	return newArr;
}