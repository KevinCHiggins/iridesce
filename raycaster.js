import {Point} from "./point.js";
//let viewDist = 100;
// starting from point orig, cast a ray with slope m and find the point
// of intersection with the closest block marked with a non-zero value in the blocks array
// of integer voxels
// note we never check if start block is solid, assuming that's not possible... 
export function creep(orig, targ, absAng, blocks) {
	let vector = new Point(targ.x - orig.x, targ.y - orig.y); //normalise(new Point(targ.x - orig.x, targ.y - orig.y));
	//console.log("Vector x " + vector.x + "vector y " + vector.y + " targ.x " + targ.x + ", y " + targ.y + " orig.x " + orig.x + ", y " + orig.y);
	let m = vector.y / vector.x; // change in y per unit x
	let invM = 1 / m; // change in x per unit y
	//let end = new Point (vector.x * viewDist, vector.y * viewDist); 
	let c = orig.y - (m * orig.x);
	let xIncreasing = (vector.x > 0);
	let yIncreasing = (vector.y > 0);
	let startX = Math.floor(orig.x);
	let startY = Math.floor(orig.y);

	var currXInt;
	var currYInt;

	specialCases(vector, xIncreasing, yIncreasing, new Point(startX, startY), blocks, orig);
	// get first X int
	if (xIncreasing) { // find point of intersection with next block to the right
		currXInt = new Point(startX + 1, solveForY(m, startX + 1, c));
	}
	else { // find intersection with left side of current block
		currXInt = new Point(startX, solveForY(m, startX, c))
	}
	// get first Y int
	if (yIncreasing) { // find intersection with next block up (in mathematical coords)
		currYInt = new Point(solveForX(m, startY + 1, c), startY + 1);
		//console.log("First Y int.x " + currYInt.x);
	}
	else { // find intersection with bottom of current block (mathematical coords)
		//console.log("Y not increasing, solving m " + m + "startY " + startY + " c " + c);
		currYInt = new Point(solveForX(m, startY, c), startY);
		//console.log("First Y int.x " + currYInt.x);
	}
	/* NO WAIT THIS INVOLVES TWICE AS MANY SQRTS !?!?:
	// save the distances between orig and where the ray first crosses unit borders
	let distToXInt = Math.sqrt((orig.x - currXInt.x) * (orig.x - currXInt.x) + (orig.y - currXInt.y) * (orig.y - currXInt.y));
	let distToYInt = Math.sqrt((orig.x - currYInt.x) * (orig.x - currYInt.x) + (orig.y - currYInt.y) * (orig.y - currYInt.y));
	// then record the distances between consecutive unit borders horiz and vert - we can add these on each time to the starting distance to keep total
	// distance to the current intersection
	let distBetweenXInts = Math.sqrt(m * m + 1);
	let distBetweenYInts = Math.sqrt(invM * invM + 1);
	*/
	//let xIters = 1;
	//let yIters = 1;
	while (true) {
		// test taking into account direction of travel and type of int
		// first find closest int
		// if x int is closer
		if (Math.abs(currXInt.x - orig.x) < Math.abs(currYInt.x - orig.x)) {
			//console.log("X int closer");
			let test = testXInt(currXInt, xIncreasing, blocks);
			if (test != 0) {
				//console.log("Returning result after " + xIters + " x iterations, " + yIters + " y iterations");
				return {type: test, hitPoint: currXInt, vertEdge: true};
			}
			if (xIncreasing) currXInt = iterateXInt(currXInt, m); // testing for this too many times...
			else currXInt = iterateXIntBack(currXInt, m);
			//distToXInt += distBetweenXInts;  // update distance by adding known distance since last border crossed
		}
		else {
			//console.log("Y int closer");
			let test = testYInt(currYInt, yIncreasing, blocks);
			if (test != 0) {
				//console.log("Returning result after " + xIters + " x iterations, " + yIters + " y iterations");
				return {type: test, hitPoint: currYInt, vertEdge: false};
			}
			if (yIncreasing) currYInt = iterateYInt(currYInt, invM); // testing for this too many times...
			else currYInt = iterateYIntBack(currYInt, invM);
			//distToYInt += distBetweenYInts; // update distance by adding known distance since last border crossed
		}
	}

}
function specialCases(vector, xIncreasing, yIncreasing, currBlock, blocks, orig) {
	//console.log("SPECIAL K vector x " + vector.x + ", y " + vector.y);
	// vertical
	if (vector.x === 0) {

		while (true) {
			if (yIncreasing) {
				currBlock.y++;
				let intersectedBlock = blocks[currBlock.x][currBlock.y];
				if (intersectedBlock != 0) {
					return {type: intersectedBlock, hitPoint: new Point(orig.x, currBlock.y)};
				}
			}
			else {
				currBlock.y--;
				let intersectedBlock = blocks[currBlock.x][currBlock.y];
				if (intersectedBlock != 0) {
					return {type: intersectedBlock, hitPoint: new Point(orig.x, currBlock.y + 1)}; // return point at bottom of the block we've hit
				}
			}
		}

	}
	// horiz
	else if (vector.y === 0) {
		while (true) {
			if (xIncreasing) {
				currBlock.x++;
				let intersectedBlock = blocks[currBlock.x][currBlock.y];
				if (intersectedBlock != 0) {
					//console.log("Dead on x increasing hit, coords " + currBlock.x + ", " + currBlock.y + ", type " +  intersectedBlock + ", play coords " + orig.x + ", " + orig.y);
					return {type:  intersectedBlock, hitPoint: new Point(currBlock.x, orig.y)};
				}
			}
			else {
				currBlock.x--;
				let intersectedBlock = blocks[currBlock.x][currBlock.y];
				if (intersectedBlock != 0) {
					return {type: intersectedBlock, hitPoint: new Point(currBlock.x, orig.y + 1)}; // return point at bottom of the block we've hit
				}
			}
		}
	}
}
function iterateXInt(lastInt, m) {
	return new Point(lastInt.x + 1, lastInt.y + m);
}
function iterateXIntBack(lastInt, m) {
	return new Point(lastInt.x - 1, lastInt.y - m);
}
function iterateYInt(lastInt, invM) {
	return new Point(lastInt.x + invM, lastInt.y + 1);
}
function iterateYIntBack(lastInt, invM) {
	//console.log("Dialing y back, lastInt.x " + lastInt.x + "lastInt.y " + lastInt.y + "invM " + invM);
	return new Point(lastInt.x - invM, lastInt.y - 1);
}
function testXInt(int, xIncreasing, blocks) {
	if (xIncreasing) { // test the block whose left side is where the intersection hit
		return blocks[Math.floor(int.x)][Math.floor(int.y)];

	}
	else { // test the block whose right side is where the intersection hit, so the block to the right of the one whose left side is where the intersection hit

		return blocks[Math.floor(int.x - 1)][Math.floor(int.y)];
	}
}
function testYInt(int, yIncreasing, blocks) {
	if (yIncreasing) { // test the block whose bottom side (maths coords) is where the intersection hit
		return blocks[Math.floor(int.x)][Math.floor(int.y)];
	}
	else { // test the block whose top (maths coords) side is where the intersection hit, so one below the one whose bottom side is where the intersection hit
		//console.log("Int x = " + int.x + ", y " + int.y);
		//console.log("Blocks length " + blocks.length + " col length "  + blocks[Math.floor(int.x)].length);
		return blocks[Math.floor(int.x)][Math.floor(int.y - 1)];
		
		
	}
}


function solveForY(m, x, c) {
	return (x * m) + c;
}
function solveForX(m, y, c) {
	return (y - c ) / m;
	
}
function normalise(vector) {
	let mag = Math.sqrt(vector.x * vector.x + vector.y * vector.y);

	return new Point(vector.x / mag, vector.y / mag);
}
