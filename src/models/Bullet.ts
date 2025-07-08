
import * as PIXI from 'pixi.js';

export class Bullet extends PIXI.Container {
    private speed: number;
    private flashFrame: number = 0;
    private bulletBody: PIXI.Graphics;
    private flashEffect: PIXI.Graphics;
    private bulletWidth: number;
    private bulletHeight: number;

    constructor(x: number, y: number, w: number, h: number, speed: number) {
        super();

        this.x = x;
        this.y = y;
        this.speed = speed;
        this.bulletWidth = w;
        this.bulletHeight = h;

        this.bulletBody = new PIXI.Graphics();
        this.createBulletGraphics();
        this.addChild(this.bulletBody);

        this.flashEffect = new PIXI.Graphics();
        this.addChild(this.flashEffect);
    }

    private createBulletGraphics(): void {
        this.bulletBody.clear();
        this.bulletBody.beginFill(0x808080);
        this.bulletBody.drawRect(0, 0, this.bulletWidth, this.bulletHeight);
        this.bulletBody.endFill();
        this.bulletBody.lineStyle(1, 0xFFFFFF);
        this.bulletBody.drawRect(0, 0, this.bulletWidth, this.bulletHeight);
    }

    private createFlashEffect(): void {
        if (this.flashFrame >= 3) return;

        this.flashEffect.clear();
        this.flashEffect.alpha = 0.8 - this.flashFrame * 0.3;

        const centerX = this.bulletWidth / 2;
        const centerY = this.bulletHeight / 2;
        const spikes = 5;
        const outerRadius = this.bulletWidth * 1.2;
        const innerRadius = this.bulletWidth * 0.4;

        this.flashEffect.beginFill(0xFFFF00);
        this.flashEffect.moveTo(centerX + outerRadius, centerY);

        for (let i = 1; i < spikes * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (i * Math.PI) / spikes;
            this.flashEffect.lineTo(
                centerX + Math.cos(angle) * radius,
                centerY + Math.sin(angle) * radius
            );
        }

        this.flashEffect.endFill();
    }

    public move(): void {
        this.x += this.speed;
        this.flashFrame++;

        if (this.flashFrame < 3) {
            this.createFlashEffect();
        } else {
            this.flashEffect.clear();
        }
    }

    public isOnScreen(screen: { width: number; height: number }): boolean {
        return (
            this.x + this.bulletWidth > 0 &&
            this.x < screen.width &&
            this.y + this.bulletHeight > 0 &&
            this.y < screen.height
        );
    }

    public getBounds(): PIXI.Rectangle {
        return new PIXI.Rectangle(this.x, this.y, this.bulletWidth, this.bulletHeight);
    }
}