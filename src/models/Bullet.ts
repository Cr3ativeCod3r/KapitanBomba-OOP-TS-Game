export class Bullet {
    x: number;
    y: number;
    w: number;
    h: number;
    speed: number;
    flashFrame: number = 0;

    constructor(
        x: number,
        y: number,
        w: number,
        h: number,
        speed: number
    ) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.speed = speed;
    }

    move() {
        this.x += this.speed;
        this.flashFrame++;
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (this.flashFrame < 3) {
            ctx.save();
            ctx.translate(this.x + this.w / 2, this.y + this.h / 2);
            ctx.globalAlpha = 0.8 - this.flashFrame * 0.3;
            ctx.shadowColor = "yellow";
            ctx.shadowBlur = 8;

            ctx.fillStyle = "yellow";
            ctx.beginPath();
            const spikes = 5;
            const outerRadius = this.w * 1.2;
            const innerRadius = this.w * 0.4;
            for (let i = 0; i < spikes * 2; i++) {
                const radius = i % 2 === 0 ? outerRadius : innerRadius;
                const angle = (i * Math.PI) / spikes;
                ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
            }
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }

        ctx.fillStyle = "gray";
        ctx.fillRect(this.x, this.y, this.w, this.h);

        ctx.fillStyle = "black";
        ctx.fillRect(this.x + this.w * 0.25, this.y, this.w * 0.5, this.h);

        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x, this.y, this.w, this.h);
    }

    isOnScreen(canvas: HTMLCanvasElement): boolean {
        return (
            this.x + this.w > 0 &&
            this.x < canvas.width &&
            this.y + this.h > 0 &&
            this.y < canvas.height
        );
    }
}