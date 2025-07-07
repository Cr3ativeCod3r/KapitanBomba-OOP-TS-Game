import { Bullet } from "./Bullet"
import { Entity } from "./Entity"

export class Player extends Entity {
    isMoving: boolean = false;

    money: number = 0;
    monstersKilled: number = 0;
    ammoSpeed: number = 10

    constructor(
        x: number,
        y: number,
        w: number,
        h: number,
        image: HTMLImageElement,
        speed: number,
        lives: number,
    ) {
        super(x, y, w, h, image, speed, lives);

        this.money = this.money;
        this.monstersKilled = this.monstersKilled
    }

    control(playerKey: string) {
        switch (playerKey) {
            case "left":
                this.x -= this.speed;
                this.walkEffect();
                break;
            case "right":
                this.x += this.speed;
                this.walkEffect();
                break;
            case "up":
                this.y -= this.speed;
                this.walkEffect();
                break;
            case "down":
                this.y += this.speed;
                this.walkEffect();
                break;
        }
    }

    checkCollisionBounds(ctx: HTMLCanvasElement) {
        if (this.x < 0) this.x = 0;
        if (this.y < 0) this.y = 0;
        if (this.x + this.w > ctx.width) this.x = ctx.width - this.w;
        if (this.y + this.h > ctx.height) this.y = ctx.height - this.h;
    }

    fire(): Bullet [] {
        //animation
        this.y -= this.speed;
        setTimeout(() => {
            this.y += this.speed;
        }, 100);

        //bullet
        return [
            new Bullet(this.x + 100, this.y + 25, 20, 10, this.ammoSpeed),
            new Bullet(this.x + 100, this.y + 50, 20, 10, this.ammoSpeed),
            new Bullet(this.x + 100, this.y + 75, 20, 10, this.ammoSpeed)
          
        ];
    }

    addLives(amount: number) {
        this.lives += amount
    }

    addSpeed(amount: number) {
        this.speed += amount
    }

    addAmmoSpeed(amount: number){
        this.ammoSpeed += amount
    }

    spendMoney(amount: number): boolean {
        if (this.money >= amount) {
            this.money -= amount;
            return true;
        }
        return false;
    }

}

