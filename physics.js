import {Point} from "./point.js";
export let theta = 0;
export let play = new Point(1.5, 2.5);
import {blocks} from "./buildmap.js";
const moveSpeed = 0.1;
const circle = Math.PI * 2;
const turnAng = 0.03;
export function turnLeft() {
	theta -= turnAng;
	if (theta >= circle) {
		theta -= circle;
	}
}
export function turnRight() {
	theta += turnAng;
	if (theta < 0) {
		theta += circle;
	}
}
export function strafeLeft() {
	let newX = play.x + Math.sin(theta) * moveSpeed;
	let newY = play.y - Math.cos(theta) * moveSpeed;
	if (blocks[Math.floor(newX)][Math.floor(newY)] === 0) {
		play.x = newX;
		play.y = newY;
	}
}
export function strafeRight() {
	let newX = play.x - Math.sin(theta) * moveSpeed;
	let newY = play.y + Math.cos(theta) * moveSpeed;
	if (blocks[Math.floor(newX)][Math.floor(newY)] === 0) {
		play.x = newX;
		play.y = newY;
	}
}
export function moveForward() {
	let newX = play.x + Math.cos(theta) * moveSpeed;
	let newY = play.y + Math.sin(theta) * moveSpeed;
	if (blocks[Math.floor(newX)][Math.floor(newY)] === 0) {
		play.x = newX;
		play.y = newY;
	}

}
export function moveBack() {
	let newX = play.x - Math.cos(theta) * moveSpeed;
	let newY = play.y - Math.sin(theta) * moveSpeed;
	if (blocks[Math.floor(newX)][Math.floor(newY)] === 0) {
		play.x = newX;
		play.y = newY;
	}

}