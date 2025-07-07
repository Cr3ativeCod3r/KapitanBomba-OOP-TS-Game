import { Entity } from "./Entity";

export class Enemy extends Entity{
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
}