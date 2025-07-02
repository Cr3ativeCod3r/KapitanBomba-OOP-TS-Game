const playHit = createAudioPool('sounds/hit.wav');
const playFall = createAudioPool('sounds/fall.wav');
const playBrick = createAudioPool('sounds/hitBrick.wav');

class Ball {
    constructor({
        x,
        y,
        r,
        color,
        directionX,
        directionY,
        soundPlay,
        restart,
        ctx,
        speed
    }) {
        this.x = x
        this.y = y
        this.r = r
        this.color = color
        this.directionX = directionX
        this.directionY = directionY
        this.soundPlay = soundPlay
        this.restart = restart
        this.ctx = ctx
        this.speed = speed
    }

    draw() {
        this.ctx.save();

        // Dodanie cienia
        this.ctx.shadowColor = this.color;
        this.ctx.shadowBlur = 15;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;

        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();

        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = 'black';
        this.ctx.stroke();

        this.ctx.restore();
    }

    moveProcess() {
        this.edgesBouncing();
        this.move();
    }

    edgesBouncing() {
        let leftEdge = this.x - this.r
        let rightEdge = this.x + this.r
        let topEdge = this.y - this.r

        if (leftEdge <= 1) {
            this.directionX = this.directionX * (-1)
            playHit();
        }
        if (topEdge <= 1) {
            this.directionY = this.directionY * (-1)
            playHit();
        }
        if (rightEdge >= canvasWidth - 1) {
            this.directionX = this.directionX * (-1)
            playHit();
        }
        if (this.y + this.r > (canvas.height - (this.r * 2))) {
            this.directionX = 0
            this.directionY = 0
            playFall();
            this.restart()
        }
    }

    move() {
        this.y -= this.directionY
        this.x -= this.directionX
    }

    paddleBouncing(paddleX, paddleY, paddleWidth, paddleHeight) {
        if (
            this.y + this.r >= paddleY &&
            this.y + this.r <= paddleY + paddleHeight &&
            this.x >= paddleX &&
            this.x <= paddleX + paddleWidth
        ) {
            let relativeIntersectX = (this.x - (paddleX + paddleWidth / 2));
            let normalized = relativeIntersectX / (paddleWidth / 2);
            let maxBounceAngle = (Math.PI / 2.5);
            let bounceAngle = normalized * maxBounceAngle;
            this.directionX = Math.sin(bounceAngle) * this.speed;
            this.directionY = -Math.cos(bounceAngle) * this.speed;

            playHit();
        }
    }

    checkBrickCollision(bricks) {
        for (let i = bricks.length - 1; i >= 0; i--) {
            let brick = bricks[i];

            if (this.x + this.r > brick.x &&
                this.x - this.r < brick.x + brick.w &&
                this.y + this.r > brick.y &&
                this.y - this.r < brick.y + brick.h) {

                let ballCenterX = this.x;
                let ballCenterY = this.y;

                let brickCenterX = brick.x + brick.w / 2;
                let brickCenterY = brick.y + brick.h / 2;

                let diffX = ballCenterX - brickCenterX;
                let diffY = ballCenterY - brickCenterY;

                let minDistX = this.r + brick.w / 2;
                let minDistY = this.r + brick.h / 2;

                let depthX = minDistX - Math.abs(diffX);
                let depthY = minDistY - Math.abs(diffY);

                if (depthX < depthY) {
                    this.directionX = -this.directionX;
                    if (diffX > 0) {
                        this.x = brick.x + brick.w + this.r;
                    } else {
                        this.x = brick.x - this.r;
                    }
                } else {
                    this.directionY = -this.directionY;
                    if (diffY > 0) {
                        this.y = brick.y + brick.h + this.r;
                    } else {
                        this.y = brick.y - this.r;
                    }
                }

                playHit();
                brick.colorpick -= 1
                brick.lives -= 1

                if (brick.lives == 0) {
                    bricks.splice(i, 1);
                }
                leftBricks.innerHTML = bricks.length
                break;
            }
        }
    }
}

