import { Bullet } from "./Bullet";
import { updateAmmo } from "../utils/achievements";
import * as PIXI from 'pixi.js';

export class Player extends PIXI.Container {
    private sprite: PIXI.Sprite;
    private playerSpeed: number;
    private currentLives: number;
    private playerWidth: number;
    private playerHeight: number;
    
    public money: number = 0;
    public monstersKilled: number = 0;
    public ammoSpeed: number = 5;
    public ammos: number = 100;
    
    constructor(
        x: number,
        y: number,
        w: number,
        h: number,
        texture: PIXI.Texture,
        speed: number,
        lives: number
    ) {
        super();
        
        this.x = x;
        this.y = y;
        this.playerSpeed = speed;
        this.currentLives = lives;
        this.playerWidth = w;
        this.playerHeight = h;
        
        // Create sprite
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.width = w;
        this.sprite.height = h;
        this.addChild(this.sprite);
    }
    
    public control(playerKey: string): void {
        switch (playerKey) {
            case "left":
                this.x -= this.playerSpeed;
                this.walkEffect();
                break;
            case "right":
                this.x += this.playerSpeed;
                this.walkEffect();
                break;
            case "up":
                this.y -= this.playerSpeed;
                this.walkEffect();
                break;
            case "down":
                this.y += this.playerSpeed;
                this.walkEffect();
                break;
        }
    }
    private walkEffect(): void {
        this.sprite.y = Math.sin(Date.now() * 0.04) * 5;
    }
    public checkCollisionBounds(screenWidth: number, screenHeight: number): void {
        if (this.x < 0) this.x = 0;
        if (this.y < 0) this.y = 0;
        if (this.x + this.playerWidth > screenWidth) this.x = screenWidth - this.playerWidth;
        if (this.y + this.playerHeight > screenHeight) this.y = screenHeight - this.playerHeight;
    }
    
    public fire(): Bullet[] {
        if (this.ammos <= 0) return [];
        const originalY = this.y;
        this.y -= this.playerSpeed;
        setTimeout(() => {
            this.y = originalY;
        }, 100);
        this.ammos -= 1;
        updateAmmo(this.ammos);
        
        return [
            new Bullet(this.x + this.playerWidth - 20, this.y + this.playerHeight / 2, 20, 10, this.ammoSpeed)
        ];
    }
    
    public get lives(): number {
        return this.currentLives;
    }
    
    public set lives(value: number) {
        this.currentLives = value;
    }
    
    public addLives(amount: number): void {
        this.currentLives += amount;
    }
    
    public addSpeed(amount: number): void {
        this.playerSpeed += amount;
    }
    
    public addAmmoSpeed(amount: number): void {
        this.ammoSpeed += amount;
    }
    
    public addAmmo(amount: number): void {
        this.ammos += amount;
    }
    
    public spendMoney(amount: number): boolean {
        if (this.money >= amount) {
            this.money -= amount;
            return true;
        }
        return false;
    }
    
    public getBounds(): PIXI.Rectangle {
        return new PIXI.Rectangle(this.x, this.y, this.playerWidth, this.playerHeight);
    }
}
