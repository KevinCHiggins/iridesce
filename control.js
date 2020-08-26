export let leftPressed = false;
export let rightPressed = false;
export let turnLeftPressed = false;
export let turnRightPressed = false;
export let upPressed = false;
export let downPressed = false;
export let render2D = false;
export let iridesce = false;

// set up the buttons in module's first run
// would be nice to do a check for device, actually
let lButton = document.getElementById('l');
let rButton = document.getElementById('r');
let fButton = document.getElementById('f');
let bButton = document.getElementById('b');
let tlButton = document.getElementById('tl');
let trButton = document.getElementById('tr');
let renButton = document.getElementById('ren');
let perspButton = document.getElementById('persp');
lButton.onmousedown = function(){
	leftPressed = true;
};
rButton.onmousedown = function(){
	rightPressed = true;
};
tlButton.onmousedown = function(){
	turnLeftPressed = true;
};
trButton.onmousedown = function(){
	turnRightPressed = true;
}
fButton.onmousedown = function(){
	upPressed = true;
};
bButton.onmousedown = function(){
	downPressed = true;
};
renButton.onclick = function(){
	iridesce = !iridesce;
};
perspButton.onclick= function(){
	render2D = !render2D;	
};
lButton.onmouseup = function(){
	leftPressed = false;
};
rButton.onmouseup = function(){
	rightPressed = false;
};
tlButton.onmouseup = function(){
	turnLeftPressed = false;
};
trButton.onmouseup = function(){
	turnRightPressed = false;
};
fButton.onmouseup = function(){
	upPressed = false;
};
bButton.onmouseup = function(){
	downPressed = false;

};
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

