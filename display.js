import {lightCol} from "./wavelength.js";
import {lightColObj} from "./wavelength.js";
import {creep} from "./raycaster.js";
//import {Point} from "./point.js";
const TEX_SIDE = 64;
const TEST_COL_OBJ = lightColObj(560);
const CIRC = Math.PI * 2;
const HALF_CIRC = Math.PI;
const QUART_CIRC = Math.PI / 2;
const THREE_QUART_CIRC = HALF_CIRC + QUART_CIRC;
let offscreen = new OffscreenCanvas(TEX_SIDE * 2, TEX_SIDE * 2);
let offscreenCtx = offscreen.getContext('2d');
var tex; 
var map;

var texData;
var mapData;


// a quick solution to the need to wait for images to load before this runs
// I call this in the whole document's onload event
export function makeTextures() {
		
	tex = document.getElementById('texture');
	offscreenCtx.drawImage(tex, 0, 0);
	texData = offscreenCtx.getImageData(0, 0, TEX_SIDE, TEX_SIDE);
	map = document.getElementById('iridmap');
	offscreenCtx.drawImage(map, 0, 0);
	mapData = offscreenCtx.getImageData(0, 0, TEX_SIDE, TEX_SIDE);


}
//offscreenCtx.drawImage(map, 64, 0);
export function display3D(ctx, points, blocks, scale, play, theta, viewAngs) {


	let width = ctx.canvas.style.width.substring(0, ctx.canvas.style.width.length - 2);
	let height = ctx.canvas.style.height.substring(0, ctx.canvas.style.height.length - 2);
	let colScale = 360.0 / width;
	let colStart = 380.0; // bottom wavelength for wavelength to RGB function
	// I flip Ys for this testing display to have mathematical coordinates

	ctx.fillStyle = 'rgba(0, 0, 0, 1)';
	ctx.fillRect(0, 0, width, height);
	

	for (let i = 0; i < points.length; i++) {

		let hit = creep(play, points[i], theta, blocks);
		// add precalc view projection angles to player angle to get this ray's angle
		
		// get fractional horizontal position of intersection on block edge (how far across)
		// will be used to calculate horizontal sampling of texture later
		let horizHitPos = hit.vertEdge? (hit.hitPoint.y * 2) % 1: (hit.hitPoint.x * 2) % 1;

		horizHitPos = Math.floor(horizHitPos * TEX_SIDE);
		//console.log("Horiz " + horizHitPos);
		let ang = theta + viewAngs[i];

		var dist;

		// calculate angle of incidence
		let inc = angOfInc(hit, play, ang);

		/*
		if (hit.vertEdge) {
			let vertDist = play.y - hit.hitPoint.y; // can be neg
			let horizDist = play.x - hit.hitPoint.x; // TEST
			let cos = Math.cos(ang); 
			dist = horizDist / cos;
			//console.log("cos of " + ((180 * ang) / Math.PI) + " is " + cos + ", vertDist " + vertDist + ", horizDist " + horizDist + ", dist " + dist);

			//let dist = Math.sqrt((play.x - hit.hitPoint.x) * (play.x - hit.hitPoint.x) + (play.y - hit.hitPoint.y) * (play.y - hit.hitPoint.y))
		}
		else {
			let vertDist = play.y - hit.hitPoint.y; // TEST
			let horizDist = play.x - hit.hitPoint.x; // can be neg

			let sin = Math.sin(ang); 
			dist = vertDist / sin;
			//console.log("sin of " + ((180 * ang) / Math.PI) + " is " + sin + ", vertDist " + vertDist + ", horizDist " + horizDist + ", dist " + dist);
		}
		dist = Math.abs(dist);
		*/
		dist = Math.sqrt((play.x - hit.hitPoint.x) * (play.x - hit.hitPoint.x) + (play.y - hit.hitPoint.y) * (play.y - hit.hitPoint.y));
		dist = dist*Math.cos(viewAngs[i]);
		ctx.fillStyle = lightCol(420+ (dist * 50));
		let wallHeight = height / (dist * 2);
		var dispHeight;
		if (dist > 0.5) {
			dispHeight = wallHeight;
		}
		else {
			dispHeight = height;
		}
		let wallTop = (height - dispHeight) / 2;
		

		//ctx.fillRect(i, wallTop, 1, wallHeight);
		let strip = ctx.createImageData(1, dispHeight);
		let samplingInc = TEX_SIDE / wallHeight;

		let texRowBytes = TEX_SIDE * 4; 
		//horizHitPos = 63;
		// start the sampling at the appropriate spot - if we are close to a wall
		// and dispHeight is smaller than wallHeight, we need to shift this down to a spot further down
		// within the texture
		let samplePos = (wallHeight - dispHeight) * (samplingInc / 2);// * texRowBytes;
		// the offset for how far across the texture we want to sample a vertical strip from
		//let horizSamplePos = horizHitPos * TEX_SIDE * 4;
		// this loop only goes to dispHeight because we don't care about data that won't be on the screen (top and bottom of a close wall)
		for (let j = 0; j < dispHeight; j++) {
			// nearest-neighbour sampling
			let pos = Math.floor(samplePos);
			samplePos += samplingInc;
			let irid = ((mapData.data[pos * texRowBytes + horizHitPos * 4]) / 512.0) * (1.5 * inc - (inc * inc)); // red value is enough as we assume map is greyscale

			//irid = 0;
			//console.log("Irid" + irid);
			let iridCol = lightColObj(420 + (inc * 50));
			strip.data[j * 4] = lerpAnyOrder(texData.data[pos * texRowBytes + horizHitPos * 4], iridCol.red, irid);
			strip.data[j * 4 +1] = lerpAnyOrder(texData.data[pos * texRowBytes + horizHitPos * 4 + 1], iridCol.green, irid);
			strip.data[j * 4 +2] = lerpAnyOrder(texData.data[pos * texRowBytes + horizHitPos * 4 + 2],  iridCol.blue, irid);
			
			/*
			strip.data[j * 4] = 40	 * inc;
			//console.log("Ang " + inc);
			strip.data[j * 4 +1] = TEST_COL_OBJ.green / 100;
			strip.data[j * 4 +2] = TEST_COL_OBJ.blue / 100;
			*/
			
			/*		
			strip.data[j * 4] = (mapData.data[pos * texRowBytes + horizHitPos * 4]);
			strip.data[j * 4 +1] = (mapData.data[pos * texRowBytes + horizHitPos * 4 + 1]);
			strip.data[j * 4 +2] = (mapData.data[pos * texRowBytes + horizHitPos * 4 + 2]);

			strip.data[j * 4] = (texData.data[pos * texRowBytes + horizHitPos * 4]);
			strip.data[j * 4 +1] = (texData.data[pos * texRowBytes + horizHitPos * 4 + 1]);
			strip.data[j * 4 +2] = (texData.data[pos * texRowBytes + horizHitPos * 4 + 2]);
*/
			strip.data[(j * 4) + 3] = 255;
		}

		ctx.putImageData(strip, i, wallTop);


	}
	function lerpAnyOrder(x, y, t) {
		if (x > y) {
			return lerp(y, x, 1 - t);
		}
		else {
			return lerp(x, y, t);
		}

	}

	function lerp(lo, hi, t) {
		return lo * (1 - t) + hi * t;	
	} 

		

}

function angOfInc(hit, player, ang) {
	if (ang > CIRC) {
		//console.log("Ang fix from " + ang);
		ang = ang - CIRC;
	}
	else if (ang < 0) {
		//console.log("Ang fi from " + ang);
		ang += CIRC;
	}
	var inc;
	if (hit.vertEdge) {
		if (hit.hitPoint.x > player.x) {
			if (ang > HALF_CIRC) {
				inc = CIRC - ang;
			}
			else {
				inc = ang;
			}
		}
		else { // ray going in direction of decreasing x
			if (ang > HALF_CIRC) {
				inc =  ang - HALF_CIRC;
			}
			else {
				inc = HALF_CIRC - ang;
			}
		}
	}
	else {
		if (hit.hitPoint.y > player.y) {
			if (ang > QUART_CIRC) {
				inc = ang - QUART_CIRC;
			}
			else {
				inc = QUART_CIRC - ang;
			}
		}
		else { // ray going in direction of decreasing y
			if (ang > THREE_QUART_CIRC) {
				inc = ang - THREE_QUART_CIRC;
			}
			else {
				inc = THREE_QUART_CIRC - ang;
			}
		}
	}
	return inc;
}


export function display2D(ctx, points, blocks, scale, play, theta, viewAngs) {
	let width = ctx.canvas.style.width.substring(0, ctx.canvas.style.width.length - 2);
	let height = ctx.canvas.style.height.substring(0, ctx.canvas.style.height.length - 2);
	let colScale = 360.0 / width;
	let colStart = 380.0; // bottom wavelength for wavelength to RGB function
	// I flip Ys for this testing display to have mathematical coordinates
	ctx.fillStyle = 'rgba(0, 0, 0, 1)';
	ctx.fillRect(0, 0, width, height);
	
	// CONFUSING HACK - I DECREASE HEIGHT BY SCALE (currently 20px) SO THE BOTTOM ROW OF TILES ISN'T PUSHED OFF-SCREEN DUE TO THE FLIPPED Y COORDS
	//height = height - scale;
	//ctx.fillRect(theta * 50, 5, 10, 10);
	for (let i = 0; i < blocks.length; i++) {
		for (let j = 0; j < blocks[i].length; j++) {
			if (blocks[i][j] > 0) {
				ctx.fillStyle = lightCol(400 + blocks[i][j] * 40);
				//ctx.fillRect(i * scale, height - (j * scale), scale, scale);;
				ctx.fillRect(i * scale, j * scale, scale, scale);
			}
		}
	}
	for (let i = 0; i < points.length; i++) {

		let hit = creep(play, points[i], theta, blocks);
		// add precalc view projection angles to player angle to get this ray's angle
		
		let ang = theta + viewAngs[i];
		let inc = angOfInc(hit, play, ang);
		var dist;
		if (hit.vertEdge) {
			let vertDist = play.y - hit.hitPoint.y; // can be neg
			let horizDist = play.x - hit.hitPoint.x; // TEST
			let cos = Math.cos(ang); 
			dist = horizDist / cos;
			//console.log("cos of " + ((180 * ang) / Math.PI) + " is " + cos + ", vertDist " + vertDist + ", horizDist " + horizDist + ", dist " + dist);

			//let dist = Math.sqrt((play.x - hit.hitPoint.x) * (play.x - hit.hitPoint.x) + (play.y - hit.hitPoint.y) * (play.y - hit.hitPoint.y))
		}
		else {
			let vertDist = play.y - hit.hitPoint.y; // TEST
			let horizDist = play.x - hit.hitPoint.x; // can be neg

			let sin = Math.sin(ang); 
			dist = vertDist / sin;
			//console.log("sin of " + ((180 * ang) / Math.PI) + " is " + sin + ", vertDist " + vertDist + ", horizDist " + horizDist + ", dist " + dist);
		}
		
		//let dist = 3;
		//console.log(hit.hitPoint);
		//**************************** TESTING *******************
		ctx.fillStyle = lightColObj(420 + (inc * 50));
		//console.log("G");
		
		//ctx.fillRect(hit.hitPoint.x * scale, (height + scale) - (hit.hitPoint.y * scale), 2, 2);
		ctx.fillRect(hit.hitPoint.x * scale, hit.hitPoint.y * scale, 2, 2);
		//**********************************************
		/*

		ctx.fillStyle = lightCol(colStart + (i * colScale));
		//console.log("X " + points[i][0] + ", Y " + points[i][1]);
		ctx.fillRect(points[i].x * scale, height - (points[i].y * scale), 2, 2);
		*/
	}

	ctx.fillStyle = lightCol(700);
	//ctx.fillRect(play.x * scale, (height + scale) - (play.y * scale), 4, 4); // AM NOW REGRETTING FLIPPING Y COORDS

	ctx.fillRect(play.x * scale, play.y * scale, 4, 4);
		
	/*
	ctx.strokeStyle = 'rgba(0, 255, 130, 1)';
	ctx.beginPath();
	ctx.moveTo(playX * scale, height - (playY * scale));
	ctx.lineTo(lineOrigX * scale, height - (lineOrigY * scale));
	ctx.stroke();
	*/
}