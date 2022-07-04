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
    let generateTerrain = terrain.length < GRID_SIZE * GRID_SIZE;

    waterCounter++;
    if (waterCounter >= waterDirections.length) {
        waterCounter = 0;
    }

    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            let terrainTypeNum = random(0, terrainTypes.length - 1),
                terrainType    = terrainTypes[terrainTypeNum],
                terrainIndex   = y * GRID_SIZE + x
            ;

            if (generateTerrain) {
                terrain[terrainIndex] = terrainTypeNum;

            } else {
                terrainType = terrainTypes[terrain[terrainIndex]];
            }
    
            drawSprite(terrainType, x, y, (terrainType === 'water' ? waterDirections[waterCounter] : 0));
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

        addApple = true;
    }

    render();
}

function render() {
    drawTerrain();
    drawSnake();

    drawSprite('apple', appleX, appleY);
}

function getSnakeCoordinates() {
    let currentDir  = 0,
        dirX        = snakePositionX,
        dirY        = snakePositionY,
        isLast      = false,
        tailX       = 0,
        tailY       = 0,
        tailDir     = snakeLastDir,
        nextDir     = 0,
        prevDir     = 0,
        bodyBendDir = -1,
        ret         = [
            {
                type: 'head',
                x   : snakePositionX,
                y   : snakePositionY,
                dir : snakeDir,
            },
        ]
    ;

    snakePositions = [ snakePositionY * GRID_SIZE + snakePositionX ];

    for (let i = snake.length - 1;  i >=0;  i--) {
        isLast = i === 0;
        tailX  = dirX;
        tailY  = dirY;

        currentDir = snake[i];

        nextDir = (i + 1) >= snake.length ? snakeDir : snake[i + 1];
        prevDir = (i - 1) < 0 ? tailDir : snake[i - 1];

        switch (currentDir) {
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

        snakePositions.push(dirY * GRID_SIZE + dirX);

        bodyBendDir = getBodyBendDirection(currentDir, prevDir, nextDir);
        if (bodyBendDir < 0) {
            ret.push({
                type: 'body',
                x   : dirX,
                y   : dirY,
                dir : currentDir,
            });

        } else {
            ret.push({
                type: 'bodyBend',
                x   : dirX,
                y   : dirY,
                dir : bodyBendDir,
            });

            if (isLast && (snakeLastDir > -1)) {
                switch (snakeLastDir) {
                    case DIRECTION_RIGHT:
                        tailX--;

                        if (currentDir === DIRECTION_UP) {
                            tailY--;
                        } else if (currentDir === DIRECTION_DOWN) {
                            tailY++;
                        }
                        break;

                    case DIRECTION_LEFT:
                        tailX++;

                        if (currentDir === DIRECTION_UP) {
                            tailY--;
                        } else if (currentDir === DIRECTION_DOWN) {
                            tailY++;
                        }
                        break;

                    case DIRECTION_UP:
                        tailY++;

                        if (currentDir === DIRECTION_LEFT) {
                            tailX--;
                        } else if (currentDir === DIRECTION_RIGHT) {
                            tailX++;
                        }
                        break;

                    case DIRECTION_DOWN:
                        tailY--;

                        if (currentDir === DIRECTION_LEFT) {
                            tailX--;
                        } else if (currentDir === DIRECTION_RIGHT) {
                            tailX++;
                        }
                        break;

                }
            }
        }
    }

    if (tailX < 0) {
        tailX = GRID_SIZE - 1;
    } else if (tailX >= GRID_SIZE) {
        tailX = 0;
    }

    if (tailY < 0) {
        tailY = GRID_SIZE - 1;
    } else if (tailY >= GRID_SIZE) {
        tailY = 0;
    }

    if ((snakePositionX === tailX) && (snakePositionY === tailY)) {
        gameover();
    }

    snakePositions.push(tailY * GRID_SIZE + tailX);

    ret.push({
        type: 'tail',
        x   : tailX,
        y   : tailY,
        dir : tailDir,
    });

    if (addApple) {
        addApple = false;

        appleX = random(0, GRID_SIZE - 1);
        appleY = random(0, GRID_SIZE - 1);

        let applePos = appleY * GRID_SIZE + appleX;

        while (snakePositions.indexOf(applePos) >= 0) {
            appleX = random(0, GRID_SIZE - 1);
            appleY = random(0, GRID_SIZE - 1);

            applePos = appleY * GRID_SIZE + appleX;
        }
    }

    return ret;
}

function drawSnake() {
    let snakeData = getSnakeCoordinates();

    for (let item of snakeData) {
        drawSprite(item.type, item.x, item.y, item.dir);
    }
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
    clearInterval(interval);
    alert('Game over! Score: ' + bodyLength);
    return;
}
