import {Point} from "./point.js";

const CIRC = Math.PI * 2;
const HALF_CIRC = Math.PI;
const QUART_CIRC = Math.PI / 2;
const THREE_QUART_CIRC = HALF_CIRC + QUART_CIRC;
//let viewDist = 100;
// starting from point orig, cast a ray with slope m and find the point
// of intersection with the closest block marked with a non-zero value in the blocks array
// of integer voxels
// note we never check if start block is solid, assuming that's not possible... 
export function creep(orig, targ, ang, absAng, blocks) {
	if (ang > CIRC) { // this wrapping could be done a little more economically when adding the view angles to the player angle
		ang = ang - CIRC;
	}
	else if(ang < 0) {
		ang = ang + CIRC;
	}
	//return {type: 1, hitPoint: new Point(1, 1)}; // for profiling - if we want to cut out the raycasting calculations altogether
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

	var angOfInc;
	if (xIncreasing && yIncreasing) {
		// get first intersections
		currXInt = new Point(startX + 1, solveForY(m, startX + 1, c));  // find point of intersection with next block to the right
		currYInt = new Point(solveForX(m, startY + 1, c), startY + 1);// find intersection with next block up (in mathematical coords)
		while (true) {
			// test taking into account direction of travel and type of int
			// first find closest int
			// if x int is closer
			if (Math.abs(currXInt.x - orig.x) < Math.abs(currYInt.x - orig.x)) {
				let test = blocks[Math.floor(currXInt.x)][Math.floor(currXInt.y)];
				if (test != 0) {

					angOfInc = Math.abs(((ang + QUART_CIRC) % CIRC) - QUART_CIRC);
					
					return {type: test, hitPoint: currXInt, vertEdge: true, ang: angOfInc};
				}
				currXInt = iterateXInt(currXInt, m); 
				
			}
			else {
				let test = blocks[Math.floor(currYInt.x)][Math.floor(currYInt.y)];
				if (test != 0) {

					angOfInc = Math.abs(ang - QUART_CIRC);

					return {type: test, hitPoint: currYInt, vertEdge: false, ang: angOfInc};
				}
				currYInt = iterateYInt(currYInt, invM); // testing for this too many times...
			}
		}
	}
	else if (xIncreasing) {
		// get first intersections
		currXInt = new Point(startX + 1, solveForY(m, startX + 1, c)); // find point of intersection with next block to the right
		currYInt = new Point(solveForX(m, startY, c), startY);// find intersection with bottom of current block (mathematical coords)
		while (true) {
			// test taking into account direction of travel and type of int
			// first find closest int
			// if x int is closer
			if (Math.abs(currXInt.x - orig.x) < Math.abs(currYInt.x - orig.x)) {
				let test = blocks[Math.floor(currXInt.x)][Math.floor(currXInt.y)];
				if (test != 0) {

					angOfInc = Math.abs(((ang + QUART_CIRC) % CIRC) - QUART_CIRC);

					return {type: test, hitPoint: currXInt, vertEdge: true, ang: angOfInc};
				}
				currXInt = iterateXInt(currXInt, m); 
;
			}
			else {
				let test = blocks[Math.floor(currYInt.x)][Math.floor(currYInt.y - 1)];
				if (test != 0) {
					angOfInc = Math.abs(ang - THREE_QUART_CIRC);
					
					return {type: test, hitPoint: currYInt, vertEdge: false, ang: angOfInc};
				}
				currYInt = iterateYIntBack(currYInt, invM);
			}
		}
	}
	else if (yIncreasing) {
		// get first intersections
		currXInt = new Point(startX, solveForY(m, startX, c))// find intersection with left side of current block
		currYInt = new Point(solveForX(m, startY + 1, c), startY + 1);// find intersection with next block up (in mathematical coords)
		while (true) {
			// test taking into account direction of travel and type of int
			// first find closest int
			// if x int is closer
			if (Math.abs(currXInt.x - orig.x) < Math.abs(currYInt.x - orig.x)) {
				let test = blocks[Math.floor(currXInt.x - 1)][Math.floor(currXInt.y)];
				if (test != 0) {
					angOfInc = Math.abs(ang - HALF_CIRC);
					
					return {type: test, hitPoint: currXInt, vertEdge: true, ang: angOfInc};
				}
				currXInt = iterateXIntBack(currXInt, m);
			}
			else {
				let test = blocks[Math.floor(currYInt.x)][Math.floor(currYInt.y)];
				if (test != 0) {
					angOfInc = Math.abs(ang - QUART_CIRC);
					
					return {type: test, hitPoint: currYInt, vertEdge: false, ang: angOfInc};
				}
				currYInt = iterateYInt(currYInt, invM); 
				
			}
		}
	}
	else {
		// get first intersections
		currXInt = new Point(startX, solveForY(m, startX, c))// find intersection with left side of current block
		currYInt = new Point(solveForX(m, startY, c), startY);// find intersection with bottom of current block (mathematical coords)
		while (true) {
			// test taking into account direction of travel and type of int
			// first find closest int
			// if x int is closer
			if (Math.abs(currXInt.x - orig.x) < Math.abs(currYInt.x - orig.x)) {
				let test = blocks[Math.floor(currXInt.x - 1)][Math.floor(currXInt.y)];
				if (test != 0) {
					angOfInc = Math.abs(ang - HALF_CIRC);
					
					return {type: test, hitPoint: currXInt, vertEdge: true, ang: angOfInc};
				}
				currXInt = iterateXIntBack(currXInt, m);
			}
			else {
				let test = blocks[Math.floor(currYInt.x)][Math.floor(currYInt.y - 1)];
				if (test != 0) {
					angOfInc = Math.abs(ang - THREE_QUART_CIRC);
					
					return {type: test, hitPoint: currYInt, vertEdge: false, ang: angOfInc};
				}
				currYInt = iterateYIntBack(currYInt, invM);
			}
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
					return {type: intersectedBlock, hitPoint: new Point(orig.x, currBlock.y), ang: QUART_CIRC};
				}
			}
			else {
				currBlock.y--;
				let intersectedBlock = blocks[currBlock.x][currBlock.y];
				if (intersectedBlock != 0) {
					return {type: intersectedBlock, hitPoint: new Point(orig.x, currBlock.y + 1), ang: THREE_QUART_CIRC}; // return point at bottom of the block we've hit
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
					return {type:  intersectedBlock, hitPoint: new Point(currBlock.x, orig.y), ang: 0};
				}
			}
			else {
				currBlock.x--;
				let intersectedBlock = blocks[currBlock.x][currBlock.y];
				if (intersectedBlock != 0) {
					return {type: intersectedBlock, hitPoint: new Point(currBlock.x, orig.y + 1), ang: HALF_CIRC}; // return point at bottom of the block we've hit
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


function solveForY(m, x, c) {
	return (x * m) + c;
}
function solveForX(m, y, c) {
	return (y - c ) / m;
	
}



//***************



function normalise(vector) {
	let mag = Math.sqrt(vector.x * vector.x + vector.y * vector.y);

	return new Point(vector.x / mag, vector.y / mag);
}
//***********

/*
function testXInt(int, xIncreasing, blocks) {
	if (xIncreasing) { // test the block whose left side is where the intersection hit
		return blocks[Math.floor(int.x)][Math.floor(int.y)];

	}
	else { // test the block whose right side is where the intersection hit, so the block to the right of the one whose left side is where the intersection hit

		return blocks[Math.floor(int.x - 1)][Math.floor(int.y)];
	}
}
function testXIntIncreasing(int, blocks) {
		return blocks[Math.floor(int.x)][Math.floor(int.y)];
}
function testXIntDecreasing(int, blocks) {

		return blocks[Math.floor(int.x - 1)][Math.floor(int.y)];

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
function testYIntIncreasing(int, blocks) {
			return blocks[Math.floor(int.x)][Math.floor(int.y)];
	
}
function testYIntDecreasing(int, blocks) {
	
		return blocks[Math.floor(int.x)][Math.floor(int.y - 1)];	
	
}
*/



//***********
/*
while (true) {
		// test taking into account direction of travel and type of int
		// first find closest int
		// if x int is closer
		if (Math.abs(currXInt.x - orig.x) < Math.abs(currYInt.x - orig.x)) {
			//console.log("X int closer");
			let test = testXInt(currXInt, xIncreasing, blocks);
			if (test != 0) {
				//console.log("Returning result after " + xIters + " x iterations, " + yIters + " y iterations");
				if (xIncreasing) {
					angOfInc = Math.abs(((ang + QUART_CIRC) % CIRC) - QUART_CIRC);
					//console.log("x increasing, ang of inc " + angOfInc);
				}
				else {
					angOfInc = Math.abs(ang - HALF_CIRC);
					//console.log("x dereasing, ang of inc " + angOfInc);
				}
				return {type: test, hitPoint: currXInt, vertEdge: true, ang: angOfInc};
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
				if (yIncreasing) {
					angOfInc = Math.abs(ang - QUART_CIRC);
					//console.log("y increasing, ang of inc " + angOfInc);
				}
				else {
					angOfInc = Math.abs(ang - THREE_QUART_CIRC);
					//console.log("y decreasing, ang of inc " + angOfInc +", vector y " + vector.y);
				}
				//console.log("Returning result after " + xIters + " x iterations, " + yIters + " y iterations");
				return {type: test, hitPoint: currYInt, vertEdge: false, ang: angOfInc};
			}
			if (yIncreasing) currYInt = iterateYInt(currYInt, invM); // testing for this too many times...
			else currYInt = iterateYIntBack(currYInt, invM);
			//distToYInt += distBetweenYInts; // update distance by adding known distance since last border crossed
		}
	}
	*/