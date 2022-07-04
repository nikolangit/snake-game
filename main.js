canvas.width  = window.innerHeight;
canvas.height = window.innerHeight;

image.src = 'sprites.png';
image.onload = function () {
    render();
}

let interval;

window.onload = function () {
    document.addEventListener('keydown', keyPush);
    interval = setInterval(game, SPEED);
}
