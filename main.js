const SPRITE_SIZE = 225,
    MAP_SIZE      = window.innerHeight,
    BLOCK_SIZE    = MAP_SIZE / 20,
    TERRAIN_TILES = 3
;

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function drawTerrain() {
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            let terrainIndex = 0;

            if (map.length < size * size) {
                terrainIndex = random(0, TERRAIN_TILES - 1);
    
                map.push(terrainIndex);

            } else {
                terrainIndex = map[y * size + x];
            }
            
            ctx.drawImage(
                image,
                terrainIndex * SPRITE_SIZE,
                2 * SPRITE_SIZE,
                SPRITE_SIZE,
                SPRITE_SIZE,
                x * BLOCK_SIZE,
                y * BLOCK_SIZE,
                BLOCK_SIZE,
                BLOCK_SIZE
            );

        }
    }
}

const canvas = document.getElementsByTagName('canvas')[0],
    ctx      = canvas.getContext('2d')
;

canvas.width  = window.innerHeight;
canvas.height = window.innerHeight;

let map = [];
let image = new Image();

let size = Math.ceil(MAP_SIZE / BLOCK_SIZE);

image.src = 'sprites.png';
image.onload = function () {
    drawTerrain();
}
