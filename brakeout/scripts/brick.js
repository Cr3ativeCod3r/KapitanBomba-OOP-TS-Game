class Brick {
    constructor(options) {
        this.x = options.x;
        this.y = options.y;
        this.w = options.w;
        this.h = options.h;
        this.color = options.color;
        this.lives = options.lives;
        this.ctx = options.ctx;
        this.soundPlay = options.soundPlay;
        this.colorpick = 3
        this.colors = {
            1: 'green',
            2: 'yellow',
            3: 'red'
        };

    }

    draw() {
        this.ctx.fillStyle = this.colors[this.colorpick];
        this.ctx.fillRect(this.x, this.y, this.w, this.h);
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(this.x, this.y, this.w, this.h);
    }
}

function drawBricks() {
    for (let brick of bricks) {
        brick.draw();
    }
}