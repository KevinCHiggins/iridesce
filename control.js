export let leftPressed = false;
export let rightPressed = false;
export let upPressed = false;
export let downPressed = false;
export let render2D = true;
onkeydown = function d(evt) {

	let code = evt.keyCode;
	if (code === 65) {
		leftPressed = true;
	}
	else if (code === 68) {
		rightPressed = true;
	}
	else if (code === 83) {
		downPressed = true;
	}
	else if (code === 87) {
		upPressed = true;
	}
}
onkeyup = function u(evt) {
	let code = evt.keyCode;
	if (code === 65) {
		leftPressed = false;
	}
	else if (code === 68) {
		rightPressed = false;
	}
	else if (code === 87) {
		upPressed = false;
	}
	else if (code === 83) {
		downPressed = false;
	}
	if (code === 88) {
		render2D = !render2D;
	}
}
onkeypress = function p(evt) {
	let code = evt.keyCode;

}

