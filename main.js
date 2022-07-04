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

function keyPush(e) {
    let error = false;

    switch (e.keyCode) {
        // left
        case 37: // Arrow
        case 100: // Numpad 4
            if (snakeDir === DIRECTION_RIGHT) {
                error = true;
                break;
            }
            snakeDir = DIRECTION_LEFT;

            snakeVelocityX = -1;
            snakeVelocityY = 0;
            break;

        // up
        case 38: // Arrow
        case 104: // Numpad 8
            if (snakeDir === DIRECTION_DOWN) {
                error = true;
                break;
            }
            snakeDir = DIRECTION_UP;

            snakeVelocityX = 0;
            snakeVelocityY = -1;
            break;

        // right
        case 39:
        case 102: // Numpad 6
            if (snakeDir === DIRECTION_LEFT) {
                error = true;
                break;
            }
            snakeDir = DIRECTION_RIGHT;

            snakeVelocityX = 1;
            snakeVelocityY = 0;
            break;

        // down
        case 40:
        case 98: // Numpad 5
        case 101: // Numpad 5
            if (snakeDir === DIRECTION_UP) {
                error = true;
                break;
            }
            snakeDir = DIRECTION_DOWN;

            snakeVelocityX = 0;
            snakeVelocityY = 1;
            break;
    }

    if (error) {
        gameover();
    }
}

function game() {
    snakePositionX += snakeVelocityX;
    snakePositionY += snakeVelocityY;

    switch (snakeDir) {
        case DIRECTION_RIGHT:
            if (snakePositionX >= GRID_SIZE) {
                snakePositionX = 0;
            }
            break;

        case DIRECTION_DOWN:
            if (snakePositionY >= GRID_SIZE) {
                snakePositionY = 0;
            }
            break;

        case DIRECTION_LEFT:
            if (snakePositionX < 0) {
                snakePositionX = GRID_SIZE - 1;
            }
            break;

        case DIRECTION_UP:
            if (snakePositionY < 0) {
                snakePositionY = GRID_SIZE - 1;
            }
            break;
    }

    snakeLastDir = snake.shift();
    snake.push(snakeDir);

    if ((appleX === snakePositionX)
        && (appleY === snakePositionY)
    ) {
        bodyLength++;

        snake.unshift(snakeLastDir);

        appleX = random(0, GRID_SIZE - 1);
        appleY = random(0, GRID_SIZE - 1);

        while ((snakeXPositions.indexOf(appleX) >= 0) && (snakeYPositions.indexOf(appleY) >= 0)) {
            appleX = random(0, GRID_SIZE - 1);
            appleY = random(0, GRID_SIZE - 1);
        }

        appleType = random(0, 1) ? 'appleRed' : 'appleYellow';
    }

    render();
}

function render() {
    drawTerrain();
    drawSnake();

    drawSprite(appleType, appleX, appleY);
}

function drawSnake() {
    let checkDir    = 0,
        dirX        = snakePositionX,
        dirY        = snakePositionY,
        isLast      = false,
        tailX       = 0,
        tailY       = 0,
        tailDir     = snakeLastDir,
        nextDir     = 0,
        prevDir     = 0,
        bodyBendDir = -1
    ;

    snakeXPositions = [];
    snakeYPositions = [];

    for (let i = snake.length - 1;  i >=0;  i--) {
        isLast = i === 0;
        tailX = dirX;
        tailY = dirY;

        checkDir = snake[i];

        nextDir = (i + 1) >= snake.length ? snakeDir : snake[i + 1];
        prevDir = (i - 1) < 0 ? tailDir : snake[i - 1];

        switch (checkDir) {
            case DIRECTION_RIGHT:
                dirX--;
                if (dirX < 0) {
                    dirX = GRID_SIZE - 1;
                }

                if (isLast) {
                    tailX = dirX - 1;
                    if (tailX < 0) {
                        tailX = GRID_SIZE - 1;
                    }
                }
                break;

            case DIRECTION_DOWN:
                dirY--;
                if (dirY < 0) {
                    dirY = GRID_SIZE - 1;
                }

                if (isLast) {
                    tailY = dirY - 1;
                    if (tailY < 0) {
                        tailY = GRID_SIZE - 1;
                    }
                }
                break;

            case DIRECTION_LEFT:
                dirX++;
                if (dirX >= GRID_SIZE) {
                    dirX = 0;
                }

                if (isLast) {
                    tailX = dirX + 1;
                    if (tailX >= GRID_SIZE) {
                        tailX = 0;
                    }
                }
                break;

            case DIRECTION_UP:
                dirY++;
                if (dirY >= GRID_SIZE) {
                    dirY = 0;
                }

                if (isLast) {
                    tailY = dirY + 1;
                    if (tailY >= GRID_SIZE) {
                        tailY = 0;
                    }
                }
                break;
        }

        if ((snakePositionX === dirX) && (snakePositionY === dirY)) {
            gameover();
        }

        snakeXPositions.push(dirX);
        snakeYPositions.push(dirY);

        bodyBendDir = getBodyBendDirection(checkDir, prevDir, nextDir);
        if (bodyBendDir < 0) {
            drawSprite('body', dirX, dirY, checkDir);
        } else {
            drawSprite('bodyBend', dirX, dirY, bodyBendDir);

            if (isLast && (snakeLastDir > -1)) {
                switch (snakeLastDir) {
                    case DIRECTION_RIGHT:
                        tailX--;
                        if (tailX < 0) {
                            tailX = GRID_SIZE - 1;
                        }

                        if (checkDir === DIRECTION_UP) {
                            tailY--;
                            if (tailY < 0) {
                                tailY = GRID_SIZE - 1;
                            }

                        } else if (checkDir === DIRECTION_DOWN) {
                            tailY++;
                            if (tailY >= GRID_SIZE) {
                                tailY = 0;
                            }
                        }
                        break;

                    case DIRECTION_LEFT:
                        tailX++;
                        if (tailX >= GRID_SIZE) {
                            tailX = 0;
                        }

                        if (checkDir === DIRECTION_UP) {
                            tailY--;
                            if (tailY < 0) {
                                tailY = GRID_SIZE - 1;
                            }

                        } else if (checkDir === DIRECTION_DOWN) {
                            tailY++;
                            if (tailY >= GRID_SIZE) {
                                tailY = 0;
                            }
                        }
                        break;

                    case DIRECTION_UP:
                        tailY++;
                        if (tailY >= GRID_SIZE) {
                            tailY = 0;
                        }

                        if (checkDir === DIRECTION_LEFT) {
                            tailX--;
                            if (tailX < 0) {
                                tailX = GRID_SIZE - 1;
                            }

                        } else if (checkDir === DIRECTION_RIGHT) {
                            tailX++;
                            if (tailX >= GRID_SIZE) {
                                tailX = 0;
                            }
                        }
                        break;

                    case DIRECTION_DOWN:
                        tailY--;
                        if (tailY < 0) {
                            tailY = GRID_SIZE - 1;
                        }

                        if (checkDir === DIRECTION_LEFT) {
                            tailX--;
                            if (tailX < 0) {
                                tailX = GRID_SIZE - 1;
                            }

                        } else if (checkDir === DIRECTION_RIGHT) {
                            tailX++;
                            if (tailX >= GRID_SIZE) {
                                tailX = 0;
                            }
                        }
                        break;

                }
            }
        }
    }

    if ((snakePositionX === tailX) && (snakePositionY === tailY)) {
        gameover();
    }

    // Head.
    drawSprite('head', snakePositionX, snakePositionY, snakeDir);

    // Tail.
    drawSprite('tail', tailX, tailY, tailDir);
}

function getBodyBendDirection(currentDir = 0, prevDir = 0, nextDir = 0) {
    let ret = -1;

    if ((prevDir === currentDir) && (nextDir === currentDir)) {
        return ret;
    }

    switch (currentDir) {
        case DIRECTION_RIGHT:
            if (prevDir === DIRECTION_UP) {
                ret = DIRECTION_RIGHT;
            } else if (prevDir === DIRECTION_DOWN) {
                ret = DIRECTION_UP;
            }
            break;

        case DIRECTION_DOWN:
            if (prevDir === DIRECTION_LEFT) {
                ret = DIRECTION_RIGHT;
            } else if (prevDir === DIRECTION_RIGHT) {
                ret = DIRECTION_DOWN;
            }
            break;

        case DIRECTION_LEFT:
            if (prevDir === DIRECTION_DOWN) {
                ret = DIRECTION_LEFT;
            } else if (prevDir === DIRECTION_UP) {
                ret = DIRECTION_DOWN;
            }
            break;

        case DIRECTION_UP:
            if (prevDir === DIRECTION_LEFT) {
                ret = DIRECTION_UP;
            } else if (prevDir === DIRECTION_RIGHT) {
                ret = DIRECTION_LEFT;
            }
            break;
    }

    return ret;
}

function gameover() {
    alert('Game over! Score: ' + bodyLength);
    clearInterval(interval);
    return;
}
const SPRITE_SIZE   = 225,
    MAP_SIZE        = window.innerHeight,
    BLOCK_SIZE      = MAP_SIZE / 20,
    GRID_SIZE       = MAP_SIZE / BLOCK_SIZE | 0,
    TERRAIN_TILES   = 3,
    DIRECTION_RIGHT = 0,
    DIRECTION_DOWN  = 90,
    DIRECTION_LEFT  = 180,
    DIRECTION_UP    = 270,
    BODY_LENGTH     = 2,
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
    snakeDir       = DIRECTION_RIGHT,
    snakePositionX = GRID_SIZE / 2 | 0,
    snakePositionY = GRID_SIZE / 2 | 0,
    snakeVelocityX = 1,
    snakeVelocityY = 0,
    snakeXPositions = [],
    snakeYPositions = [],
    snake           = [],
    snakeLastDir    = -1,
    bodyLength      = BODY_LENGTH,
    appleX    = random(0, GRID_SIZE - 1),
    appleY    = random(0, snakePositionY - 1),
    appleType = random(0, 1) ? 'appleRed': 'appleYellow',
    map = [],
    image = new Image()
;

canvas.width  = window.innerHeight;
canvas.height = window.innerHeight;

for (let i = 0; i < bodyLength; i++) {
    snake.push(snakeDir);
}

image.src = 'sprites.png';
image.onload = function () {
    render();
}

let interval;

window.onload = function () {
    document.addEventListener('keydown', keyPush);
    interval = setInterval(game, SPEED);
}
