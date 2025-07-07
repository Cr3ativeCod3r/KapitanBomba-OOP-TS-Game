import { Entity } from "./Entity";

export class Enemy extends Entity {
    damage: number;
    constructor(
        x: number,
        y: number,
        w: number,
        h: number,
        image: HTMLImageElement,
        speed: number,
        lives: number,
        damage: number
    ) {
        super(x, y, w, h, image, speed, lives);
        this.damage = damage;
    }

    move() {
        this.x -= this.speed
        this.walkEffect()
    }

    override draw(ctx: CanvasRenderingContext2D): void {
        ctx.drawImage(this.image, this.x, this.y, this.w, this.h);

        if (this.damage > 0) {
            const dotSize = 4;
            const dotSpacing = 3;
            const startX = this.x;
            const startY = this.y - dotSize - 10;

            // Rysuj kropki reprezentujące życia
            for (let i = 0; i < this.lives; i++) {
                const dotX = startX + i * (dotSize * 2 + dotSpacing);
                const dotY = startY;

                ctx.fillStyle = 'red';
                ctx.beginPath();
                ctx.arc(dotX + dotSize, dotY + dotSize, dotSize, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }


}