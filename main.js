import {leftPressed} from "./control.js";
import {rightPressed} from "./control.js";
import {turnLeftPressed} from "./control.js";
import {turnRightPressed} from "./control.js";
import {upPressed} from "./control.js";
import {downPressed} from "./control.js";
import {turnLeft} from "./physics.js";
import {turnRight} from "./physics.js";
import {strafeLeft} from "./physics.js";
import {strafeRight} from "./physics.js";
import {moveForward} from "./physics.js";
import {moveBack} from "./physics.js";
import {render2D} from "./control.js";
import {iridesce} from "./control.js";
import {theta} from "./physics.js";
import {play} from "./physics.js";
import {lightCol} from "./wavelength.js";

import {setup} from "./display.js";
import {makeTextures} from "./display.js";
import {display2D} from "./display.js";
import {display3D} from "./display.js";
import {Point} from "./point.js";
import {blocks} from "./buildmap.js";

let c = document.getElementById("c");
const WIDTH = 400;
const HEIGHT = 300;
const FOV= Math.PI / 2;


let lineOrig = new Point(0, 0);

// find the distance between intersections of rays with a line 1 unit in front of the player, so that WIDTH rays fit in the fov
// the angles are not evenly spaced, this is so that walls will be straight not curved (1 point perspective, letting the screen's
// distance (e.g. at corners) from the viewer compensate)
console.log("Light colour 400 " + lightCol(400) + ", 580 " + lightCol(580));
const VIEW_PLANE_INC = (2 * Math.tan(FOV / 2)) / WIDTH;

c.style.width = WIDTH + "px";
c.style.height = HEIGHT + "px";
let ctx = c.getContext('2d');
setup(ctx);
let previousTimestamp = 0;

let viewAngs = getViewPlaneAngles();//getViewArcPoints(0, play).angs;//getViewPlaneAngles();
function gameLoop(timestamp) {
	//console.log(timestamp - previousTimestamp);
	previousTimestamp = timestamp;
	if (rightPressed && leftPressed) {
		//console.log("RL");
	}
	else if (rightPressed) {
		//console.log("R" + theta);
		strafeRight();

	}
	else if (leftPressed) {
		//console.log("L" + theta);
		strafeLeft();

	}
	if (turnRightPressed && turnLeftPressed) {
		//console.log("RL");
	}
	else if (turnRightPressed) {
		//console.log("R" + theta);
		turnRight();

	}
	else if (turnLeftPressed) {
		//console.log("L" + theta);
		turnLeft();

	}
	if (upPressed && downPressed) {
		//console.log("RL");
	}
	else if (upPressed) {
		moveForward();
	}
	else if (downPressed) {
		moveBack();
	}
	let points = getViewPlanePoints(theta, play);//getViewArcPoints(theta, play).points;

	if (render2D) {
		display2D(ctx, points, blocks, play, theta, viewAngs);
	}
	else {
		display3D(ctx, points, blocks, play, theta, viewAngs,  iridesce);
	}
	window.requestAnimationFrame(gameLoop)

}
let asset1 = document.getElementById('iridmap');
let asset2 = document.getElementById('texture');
let bodyElement = document.body;
console.log("Body: " + bodyElement);
bodyElement.onload = function() {

	console.log("Loaded. Starting.");
	makeTextures();
	window.requestAnimationFrame(gameLoop)
}

// this is to get the angles of the projections to the points equally spaced on the view plane
// these angles are used to calculate distance to intersections with right-angled walls
// in display.js
// but not used to calculate the actual intersection coordinates in raycaster.js
// This function RUNS ONCE to store the angles and then they are just added to the player's angle
function getViewPlaneAngles() {
	let points = getViewPlanePoints(0, new Point (0, 0));
	let arrOfAngs = [];
	console.log("PointS: "+ points.length);
	for (let i = 0; i < points.length; i++) {
		arrOfAngs[i] = Math.atan(points[i].y);
		//console.log("Atan of x" + points[i].x + ", y " + points[i].y + " is " + arrOfAngs[i]);
	}
	return arrOfAngs;
}

function getViewPlanePoints(ang, orig) {
	// BTW The "view plane" is of course just a line, but I use plane because it's more evocative of what it does

	// calculate intersection point of centre (straight) ray with view plane (that is, the end coord of a unit line projected in front of player)
	lineOrig = new Point(Math.cos(ang) + orig.x, Math.sin(ang) + orig.y)

	// calculate x and y displacement of travelling left to right by one pixel along view plane
	let lineDisp = new Point(0 - (Math.sin(theta) * VIEW_PLANE_INC), Math.cos(theta) * VIEW_PLANE_INC);

	let arrOfPoints = [];
	let arrOfAngs = [];

	// calculate an initial value at left of plane so we can sweep across it using addition instead of multiplication within the loop
	let sweep = new Point(lineOrig.x + (lineDisp.x * (0 - WIDTH / 2)), lineOrig.y + (lineDisp.y * (0 - WIDTH / 2)));

	// because our starting point is to the left of the central ray, i.e. it's for negative ang, this loop calculates
	// where rays on either side (positive and negative) of ang hit the view plane, sweeping from left to right
	for (let i = 0; i < WIDTH; i++) {
		// Calc pos of point on orthogonal line (view plane) for "i"th pixel across
		sweep.x = sweep.x + (lineDisp.x);
		sweep.y = sweep.y + (lineDisp.y);

		arrOfPoints.push(new Point (sweep.x, sweep.y)); // deep copy because otherwise all array entries point to one object
	}

	return arrOfPoints;
	//return [lineOrig]; / single test point
}
// This function combines finding the angles and the intersection points because it'd be silly to recalculate the trig a second time
// to recover the angles from the points, whereas for the view plane case this makes sense as the points are calculated without trig
// by spacing them evenly on a line
function getViewArcPoints(ang, orig) {
	let arrOfPoints = [];
	let arrOfAngs = [];
	let sweepAng = ang + (FOV / 2); // turn to left start of sweep
	let inc = FOV / WIDTH; // determine angular increment between each ray
	for (let i = 0; i < WIDTH; i++) {
		// Calc pos of point on view arc for "i"th pixel across
		let x = orig.x + Math.cos(sweepAng);
		let y = orig.y + Math.sin(sweepAng);
		sweepAng -= inc;
		arrOfAngs.push(sweepAng);
		arrOfPoints.push(new Point (x, y)); // deep copy because otherwise all array entries point to one object
		//console.log("Saving point x " + x + ", y " + y + ", ang " + (180 * sweepAng / Math.PI) + " pos " + i);
	}
	return {points: arrOfPoints, angs: arrOfAngs};
}


