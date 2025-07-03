const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// div
const lives = document.getElementById("lives");
const leftBricks = document.getElementById("leftBricks");
// images
const heart = document.getElementById("heart");
const face = document.getElementById("face");

// sounds
const gameOver = new Audio('sounds/game_over.flac');
const gameSound = new Audio('sounds/game.wav');
const facesound = new Audio('sounds/scream.wav');
const laugh = new Audio('sounds/laugh.wav');

// objects
let paddle;
let ball;
let brick;
let bricks = [];

// canvas
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;
let currentColor = 'black';

// player
let mouseX = 0;
let initHealth = 3;
let health = 3;

// ball
let ballWaiting = false;
let ballStartTimeout = null;

let startX = 300;
let startY = 400;

let startDX = 0;
let startDY = -12;
let speed = -12;

// bricks
let brickRows = 13;
let brickCols = 10;

let brickWidth = 48;
let brickHeight = 20;

let brickSpacing = 8;

let brickTopOffset = 40;
let brickLeftOffset = 16;

let currentLevel = 'medium';

let gameEnded = false;
let animationFrameId = null;


function drawElemens() {
    const config = levelConfigs[currentLevel];

    ball = new Ball({
        x: startX,
        y: startY,
        r: 10,
        color: config.ballColor,
        directionX: startDX,
        directionY: startDY,
        soundPlay,
        restart,
        ctx,
        speed: config.ballSpeed
    });

    paddle = new Paddle({
        x: 225,
        y: 520,
        w: config.paddleWidth,
        h: 20,
        color: 'gray'
    });

    brickCols = config.brickCols;
    brickRows = config.brickRows;

    let totalBricksWidth = brickCols * brickWidth + (brickCols - 1) * brickSpacing;
    let startXBricks = (canvas.width - totalBricksWidth) / 2;

    bricks = [];
    for (let row = 0; row < brickRows; row++) {
        for (let col = 0; col < brickCols; col++) {
            let x = startXBricks + col * (brickWidth + brickSpacing);
            let y = brickTopOffset + row * (brickHeight + brickSpacing);
            let brick = new Brick({
                x,
                y,
                w: brickWidth,
                h: brickHeight,
                color: "orange",
                lives: config.brickLives,
                ctx,
                soundPlay
            });
            bricks.push(brick);
        }
    }
}

let frames = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    createRect(0, 0, canvas.width, canvas.height, "black");
    if (ball) ball.draw();
    if (paddle) paddle.draw();
    drawBricks();
};

let restart = () => {
    health -= 1;
    renderHearts(health);
    onLose();
    ball.x = startX;
    ball.y = 400;
    setTimeout(() => {
        ball.directionX = startDX;
        ball.directionY = startDY;
    }, 1500);
};

let update = () => {
    paddle.followMouse(mouseX);
    if (!ballWaiting) {
        ball.moveProcess();
        ball.paddleBouncing(paddle.x, paddle.y, paddle.w, paddle.h);
        ball.checkBrickCollision(bricks);
    }
    if (bricks.length === 0) {
        onWin();
    }
};

let gameLoop = () => {
    if (gameEnded) return;
    update();
    frames();
    animationFrameId = requestAnimationFrame(gameLoop);
};

let onLose = () => {
    if (health == 0) {
        gameEnded = true;
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        ball = null;
        paddle = null;
        renderHearts(health);
        soundPlay(gameOver);
        soundPlay(laugh);
        clearCanvas();
        ctx.font = 'bold 64px Arial, sans-serif';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = '#000';
        ctx.shadowBlur = 8;
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
        setTimeout(() => {
            clearCanvas();
            startButton();
            clearInterval(colors);
        }, 3000);
    }
};



let play = () => {
    gameEnded = false;
    
    if (animationFrameId) cancelAnimationFrame(animationFrameId);

   
    const config = levelConfigs[currentLevel];
    health = config.lives;
    initHealth = config.lives;
    speed = config.ballSpeed;
    startDY = config.ballSpeed;
    startY = 400;
    
    renderHearts(health);
    drawElemens();

    ballWaiting = true;
    ball.directionX = 0;
    ball.directionY = 0;

    frames();
    leftBricks.innerHTML = bricks.length;

    if (ballStartTimeout) clearTimeout(ballStartTimeout);
    ballStartTimeout = setTimeout(() => {
        ballWaiting = false;
        ball.directionX = startDX;
        ball.directionY = startDY;
    }, 2000);

    animationFrameId = requestAnimationFrame(gameLoop);
};



function onWin() {
    gameEnded = true;
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    ball = null;
    paddle = null;
    facesound.play();
    alert("Gratulacje wygrałeś iphona!");
    clearCanvas();
    startButton();
}


startButton();