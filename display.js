import {lightCol} from "./wavelength.js";
import {creep} from "./raycaster.js";
//import {Point} from "./point.js";

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
		
		let ang = theta + viewAngs[i];

		var dist;
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
		var wallHeight;

		if (dist > 0.5) {
			wallHeight = height / (dist * 2);
		}
		else {
			wallHeight = height;
		}
		let wallTop = (height - wallHeight) / 2;
		
		ctx.fillRect(i, wallTop, 1, wallHeight);

	}

		

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
		ctx.fillStyle = lightCol(420+ (Math.abs(dist) * 50));
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