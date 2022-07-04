const SPRITE_SIZE   = 225,
    MAP_SIZE        = window.innerHeight,
    GRID_SIZE       = 12,
    BLOCK_SIZE      = MAP_SIZE / GRID_SIZE,
    DIRECTION_RIGHT = 0,
    DIRECTION_DOWN  = 90,
    DIRECTION_LEFT  = 180,
    DIRECTION_UP    = 270,
    SPEED           = 1000 / 10
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
        apple: {
            x: 1,
            y: 1,
        },
        water: {
            x: 2,
            y: 1,
        },
        sand: {
            x: 0,
            y: 2,
        },
        ground: {
            x: 1,
            y: 2,
        },
        grass: {
            x: 2,
            y: 2,
        },
    },
    snakeDir       = DIRECTION_RIGHT,
    snakePositionX = GRID_SIZE / 2 | 0,
    snakePositionY = GRID_SIZE / 2 | 0,
    snakeVelocityX = 1,
    snakeVelocityY = 0,
    snakePositions = [],
    snake          = [
        // Snake end.
        DIRECTION_RIGHT,
        DIRECTION_RIGHT,
        DIRECTION_RIGHT,
        DIRECTION_RIGHT,
        DIRECTION_RIGHT,
        // Snake start.
    ],
    snakeLastDir = snake[0],
    bodyLength   = snake.length,
    addApple = false,
    appleX   = random(0, GRID_SIZE - 1),
    appleY   = random(0, snakePositionY - 1),
    terrain      = [],
    terrainTypes = [
        'water',
        'sand',
        'ground',
        'grass',
    ],
    waterCounter    = -1,
    waterDirections = [
        DIRECTION_RIGHT,
        DIRECTION_RIGHT,
        DIRECTION_LEFT,
        DIRECTION_LEFT,
        DIRECTION_RIGHT,
        DIRECTION_RIGHT,
        DIRECTION_DOWN,
        DIRECTION_DOWN,
        DIRECTION_UP,
        DIRECTION_UP,
    ],
    image = new Image()
;
