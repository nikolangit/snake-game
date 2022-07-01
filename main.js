function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function drawSprite(type = 'body', x = 0, y = 0, angle = 0) {
    x *= BLOCK_SIZE;
    y *= BLOCK_SIZE;

    let sx                 = spritesData[type].x * SPRITE_SIZE,
        sy                 = spritesData[type].y * SPRITE_SIZE,
        w2                 = BLOCK_SIZE / 2,
        h2                 = BLOCK_SIZE / 2,
        radian             = angle * Math.PI / 180,
        translateX         = x + w2,
        translateY         = y + h2,
        translateXNegative = -x - w2,
        translateYNegative = -y - h2
    ;

    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'red';
    ctx.rect(x, y, BLOCK_SIZE, BLOCK_SIZE);
    ctx.stroke();

    ctx.translate(translateX, translateY);
    ctx.rotate(radian);
    ctx.drawImage(
        image,
        sx,
        sy,
        SPRITE_SIZE,
        SPRITE_SIZE,
        -BLOCK_SIZE / 2,
        -BLOCK_SIZE / 2,
        BLOCK_SIZE,
        BLOCK_SIZE
    );
    ctx.rotate(-radian);
    ctx.translate(translateXNegative, translateYNegative);
}

function drawTerrain() {
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            let terrainIndex = 0;

            if (map.length < GRID_SIZE * GRID_SIZE) {
                terrainIndex = random(0, TERRAIN_TILES - 1);
    
                map.push(terrainIndex);

            } else {
                terrainIndex = map[y * GRID_SIZE + x];
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

const SPRITE_SIZE = 225,
    MAP_SIZE      = window.innerHeight,
    BLOCK_SIZE    = MAP_SIZE / 15,
    GRID_SIZE     = MAP_SIZE / BLOCK_SIZE | 1,
    TERRAIN_TILES = 3
;

const canvas = document.getElementsByTagName('canvas')[0],
    ctx      = canvas.getContext('2d')
;

let spritesData = {
        bodyBend: {
            x: 0,
            y: 0,
        },
        body: {
            x: 1,
            y: 0,
        },
        head: {
            x: 2,
            y: 0,
        },
        tail: {
            x: 0,
            y: 1,
        },
        appleRed: {
            x: 1,
            y: 1,
        },
        appleYellow: {
            x: 2,
            y: 1,
        },
        sand1: {
            x: 0,
            y: 2,
        },
        sand2: {
            x: 1,
            y: 2,
        },
        grass: {
            x: 2,
            y: 2,
        },
    },
    map = [],
    image = new Image()
;

canvas.width  = window.innerHeight;
canvas.height = window.innerHeight;

image.src = 'sprites.png';
image.onload = function () {
    drawTerrain();
}
