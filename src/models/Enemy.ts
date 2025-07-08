import * as PIXI from 'pixi.js';

export class Enemy extends PIXI.Container {
    private sprite: PIXI.Sprite;
    private healthDots: PIXI.Graphics;
    private enemySpeed: number;
    private currentLives: number;
    public damage: number;
    public w: number;
    public h: number;
    
    constructor(
        x: number,
        y: number,
        w: number,
        h: number,
        textureSource: string,
        speed: number,
        lives: number,
        damage: number
    ) {
        super();
        
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.enemySpeed = speed;
        this.currentLives = lives;
        this.damage = damage;
        
        this.sprite = new PIXI.Sprite(PIXI.Texture.from(textureSource));
        this.sprite.width = w;
        this.sprite.height = h;
        this.addChild(this.sprite);
        
        this.healthDots = new PIXI.Graphics();
        this.healthDots.y = -15;
        this.addChild(this.healthDots);
        
        this.updateHealthDisplay();
    }
    
    private updateHealthDisplay(): void {
        if (this.damage <= 0) return; 
        
        this.healthDots.clear();

        const dotSize = 4;
        const dotSpacing = 3;

        for (let i = 0; i < this.currentLives; i++) {
            const dotX = i * (dotSize * 2 + dotSpacing);
            this.healthDots.beginFill(0xFF0000);
            this.healthDots.drawCircle(dotX + dotSize, dotSize, dotSize);
            this.healthDots.endFill();
        }
    }

    public move(): void {
        this.x -= this.enemySpeed;
        this.walkEffect();
    }
    
    private walkEffect(): void {
        this.sprite.y = Math.sin(Date.now() * 0.01) * 2;
    }
    
    public takeDamage(amount: number = 1): void {
        this.currentLives -= amount;
        this.updateHealthDisplay();
    }
    
    public get lives(): number {
        return this.currentLives;
    }
    
    public set lives(value: number) {
        this.currentLives = value;
        this.updateHealthDisplay();
    }
    
    public get speed(): number {
        return this.enemySpeed;
    }
    
    public set speed(value: number) {
        this.enemySpeed = value;
    }
    
    public setTexture(textureSource: string): void {
        this.sprite.texture = PIXI.Texture.from(textureSource);
    }
    
    public turnIntoPoop(poopTexture: string): void {
        this.damage = 0;
        this.enemySpeed = 0;
        this.sprite.texture = PIXI.Texture.from(poopTexture);
        this.healthDots.clear(); 
    }
    
    public getBounds(): PIXI.Rectangle {
        return new PIXI.Rectangle(this.x, this.y, this.w, this.h);
    }
}
