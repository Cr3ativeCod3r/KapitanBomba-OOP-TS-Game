export class Entity {
    public x: number;
    public y: number;
    public w: number;
    public h: number;
    public image: HTMLImageElement;
    public speed: number;
    public lives: number;

    public walkTime: number = 0; 

    constructor(
        x: number,
        y: number,
        w: number,
        h: number,
        image: HTMLImageElement,
        speed: number,
        lives: number
    ) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.image = image;
        this.speed = speed;
        this.lives = lives;
    }
    draw(ctx: CanvasRenderingContext2D): void {
        ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
    }
    walkEffect(){
        this.walkTime += 0.5;
        this.y += Math.sin(this.walkTime);
    }
}

