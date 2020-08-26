export let leftPressed = false;
export let rightPressed = false;
export let turnLeftPressed = false;
export let turnRightPressed = false;
export let upPressed = false;
export let downPressed = false;
export let render2D = false;
export let iridesce = false;
onkeydown = function d(evt) {

	let code = evt.keyCode;
	if (code === 90) {
		turnLeftPressed = true;
	}
	else if (code === 67) {
		turnRightPressed = true;
	}
	else if (code === 65) {
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
	if (code === 88) {
		render2D = !render2D;
	}
	if (code === 73) {
		console.log("B")
		iridesce = !iridesce;
	}
}
onkeyup = function u(evt) {
	let code = evt.keyCode;
	if (code === 90) {
		turnLeftPressed = false;
	}
	else if (code === 67) {
		turnRightPressed = false;
	}
	else if (code === 65) {
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

}
onkeypress = function p(evt) {
	let code = evt.keyCode;

}

