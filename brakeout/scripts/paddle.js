class Paddle {
    constructor({
        x,
        y,
        w,
        h, 
        color
   }) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.color = color
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }

    followMouse(mouseX) {
        const halfWidth = this.w / 2;
        let newX = mouseX - halfWidth;
        newX = Math.max(0, Math.min(canvasWidth - this.w, newX));
        this.x = newX;
    }
}

