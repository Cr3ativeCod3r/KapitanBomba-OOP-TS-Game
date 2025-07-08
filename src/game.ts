import * as PIXI from 'pixi.js';
import { Player } from "./models/Player";
import { Bullet } from "./models/Bullet";
import { Shop } from "./models/Shop";
import { Enemy } from "./models/Enemy";
import { images } from "./assets/images";
import { playerKey } from "./utils/control"
import { playSound } from "./utils/soundPlayer";
import { updateMonstersKilled } from "./utils/achievements"
import { updateLives, updatePoops, updateAmmo } from "./utils/achievements"
import { drawGameOverWithPixi } from './scenes/gameOver';

export class Game {
    //graphis
    private app: PIXI.Application = new PIXI.Application();
    private gameContainer: PIXI.Container = new PIXI.Container();
    private backgroundSprite: PIXI.Sprite = new PIXI.Sprite();
    private bullets: Array<Bullet> = [];
    private enemies: Array<Enemy> = [];
    private player: Player;
    private shop: Shop = new Shop();

    // Game state
    private enemyInterval: number = 1000;
    private enemyIntervalId: number | undefined;
    private gameIntervalId: number | undefined;
    private enemyLevelIntervalId: number | undefined;
    private isGameOver: boolean = false;
    private enemyW: number = 100;
    private enemyH: number = 100;
    private correctionImages: number = 50;
    private enemylvl: number = 1;

    // Fire key handling
    private fireKeyDownTime: number | null = null;
    private fireKeyHeldTimeout: number | null = null;

    
    constructor(private canvasId: string) { }
    
    public async init(): Promise<void> {
        const canvas = document.getElementById(this.canvasId) as HTMLCanvasElement;

        this.app = new PIXI.Application();

        await this.app.init({
            canvas: canvas,
            width: canvas.width,
            height: canvas.height,
            backgroundColor: 0x000000,
            antialias: true
        });

        this.gameContainer = new PIXI.Container();
        this.app.stage.addChild(this.gameContainer);

        this.createBackground();
        this.initPlayer();
        this.initShop();
        this.setupEventListeners();
    }


    private createBackground(): void {
        this.backgroundSprite = new PIXI.Sprite(PIXI.Texture.from(images.galaktyka));
        this.backgroundSprite.width = this.app.screen.width;
        this.backgroundSprite.height = this.app.screen.height;
        this.backgroundSprite.alpha = 0.5;
        this.gameContainer.addChild(this.backgroundSprite);
    }

    private initPlayer(): void {
        this.player = new Player(200,
            200,
            120,
            120,
            PIXI.Texture.from(images.player),
            5,
            3);

        this.gameContainer.addChild(this.player);
        updateLives(this.player.lives);
        updateAmmo(this.player.ammos);
        updateMonstersKilled(this.player.monstersKilled);
    }

    private initShop(): void {
        this.shop = new Shop();
    }


    private setupEventListeners(): void {
        window.addEventListener("keydown", (e) => {
            if (e.key.toLowerCase() === "e" && !this.isGameOver) {
                this.handleFireKeyDown();
            }
        });

        window.addEventListener("keyup", (e) => {
            if (e.key.toLowerCase() === "e") {
                this.handleFireKeyUp();
            }
        });

        document.querySelectorAll<HTMLButtonElement>('.shopItem[data-type]').forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.getAttribute('data-type');
                if (type) {
                    this.handleShopClick(type);
                }
            });
        });
    }

    private handleFireKeyDown(): void {
        if (this.fireKeyDownTime === null) {
            this.fireKeyDownTime = Date.now();
            this.fireKeyHeldTimeout = window.setTimeout(() => {
                playSound("okrzyk");
            }, 1000);
        }
        playSound("shot");

        const bulletsToAdd = this.player.fire();
        for (const bullet of bulletsToAdd) {
            this.bullets.push(bullet);
            this.gameContainer.addChild(bullet);
        }
    }

    private handleFireKeyUp(): void {
        this.fireKeyDownTime = null;
        if (this.fireKeyHeldTimeout !== null) {
            clearTimeout(this.fireKeyHeldTimeout);
            this.fireKeyHeldTimeout = null;
        }
    }

    private handleShopClick(type: string): void {
        switch (type) {
            case 'ammo':
                this.shop.buyAmmo(this.player);
                updateAmmo(this.player.ammos);
                break;
            case 'fasterShooting':
                this.shop.buyAmmoSpeed(this.player);
                break;
            case 'life':
                this.shop.buyHealth(this.player);
                updateLives(this.player.lives);
                break;
            case 'upgradeWeapon':
                // TODO: Implement weapon upgrade
                break;
        }
        updatePoops(this.player.money);
        this.updateStatsBar();
    }

    private gameLoop(): void {
        if (this.isGameOver) {
            drawGameOverWithPixi(this.app, this.gameContainer, this.player, this.restartGame.bind(this));
            return;
        }

        this.updatePlayer();
        this.updateEnemies();
        this.updateBullets();
        this.checkCollisions();
    }

    private updatePlayer(): void {
        this.player.control(playerKey);
        this.player.checkCollisionBounds(this.app.screen.width, this.app.screen.height);
    }

    private updateEnemies(): void {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            let enemy = this.enemies[i];
            enemy.move();

            if (enemy.x + enemy.w < 0) {
                this.gameContainer.removeChild(enemy);
                this.enemies.splice(i, 1);
            }
        }
    }

    private updateBullets(): void {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            if (!bullet.isOnScreen({ width: this.app.screen.width, height: this.app.screen.height })) {
                this.gameContainer.removeChild(bullet);
                this.bullets.splice(i, 1);
            }
        }

        for (const bullet of this.bullets) {
            bullet.move();
        }
    }

    private checkCollisions(): void {
        this.checkPlayerEnemyCollisions();
        this.checkBulletEnemyCollisions();
    }

    private checkPlayerEnemyCollisions(): void {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            let enemy = this.enemies[i];

            if (this.isPlayerEnemyCollision(enemy)) {
                if (enemy.damage === 0) {
                    this.player.money += 1;
                    updatePoops(this.player.money);
                    this.gameContainer.removeChild(enemy);
                    this.enemies.splice(i, 1);
                } else {
                    this.player.lives -= enemy.damage;
                    updateLives(this.player.lives);
                    this.gameContainer.removeChild(enemy);
                    this.enemies.splice(i, 1);
                    if (this.player.lives <= 0) {
                        this.gameOver();
                        return;
                    }
                }
            }
        }
    }

    private checkBulletEnemyCollisions(): void {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            let bullet = this.bullets[i];
            let bulletHitEnemy = false;

            for (let j = this.enemies.length - 1; j >= 0; j--) {
                let enemy = this.enemies[j];

                if (this.isBulletEnemyCollision(bullet, enemy)) {
                    enemy.lives -= 1;

                    if (enemy.damage > 0) {
                        bulletHitEnemy = true;

                        if (enemy.lives == 0) {
                            if (Math.random() < 0.2) {
                                enemy.damage = 0;
                                enemy.speed = 0;
                                enemy.setTexture(images.poop)
                            } else {
                                this.gameContainer.removeChild(enemy);
                                this.enemies.splice(j, 1);
                                this.player.monstersKilled += 1;
                                updateMonstersKilled(this.player.monstersKilled);
                            }
                            break;
                        }
                    }
                }
            }

            if (bulletHitEnemy) {
                this.gameContainer.removeChild(bullet);
                this.bullets.splice(i, 1);
            }
        }
    }

    private isPlayerEnemyCollision(enemy: Enemy): boolean {
        const playerBounds = this.player.getBounds();
        const enemyBounds = enemy.getBounds();

        return (
            playerBounds.x < enemyBounds.x + enemyBounds.width - this.correctionImages &&
            playerBounds.x + playerBounds.width > enemyBounds.x + this.correctionImages &&
            playerBounds.y < enemyBounds.y + enemyBounds.height &&
            playerBounds.y + playerBounds.height > enemyBounds.y
        );
    }

    private isBulletEnemyCollision(bullet: Bullet, enemy: Enemy): boolean {
        const bulletBounds = bullet.getBounds();
        const enemyBounds = enemy.getBounds();

        return (
            bulletBounds.x < enemyBounds.x + enemyBounds.width &&
            bulletBounds.x + bulletBounds.width > enemyBounds.x &&
            bulletBounds.y < enemyBounds.y + enemyBounds.height &&
            bulletBounds.y + bulletBounds.height > enemyBounds.y
        );
    }

    private startEnemySpawner(): void {
        if (this.enemyIntervalId !== undefined) {
            clearInterval(this.enemyIntervalId);
        }

        this.enemyIntervalId = setInterval(() => {
            if (!this.isGameOver) {
                this.spawnEnemy();
            }
        }, this.enemyInterval);
    }

    private spawnEnemy(): void {
        const randomY = Math.random() * (this.app.screen.height - this.enemyH);
        const enemy = new Enemy(
            this.app.screen.width - this.enemyW,
            randomY,
            this.enemyW,
            this.enemyH,
            images.enemyKurvinox,
            1,
            this.enemylvl,
            1
        );
        this.enemies.push(enemy);
        this.gameContainer.addChild(enemy);
    }

    private startGameInterval(): void {
        if (this.gameIntervalId !== undefined) {
            clearInterval(this.gameIntervalId);
        }

        this.gameIntervalId = setInterval(() => {
            if (!this.isGameOver && this.enemyInterval > 200) {
                this.enemyInterval = Math.max(200, this.enemyInterval - 25);
                this.startEnemySpawner();
            }
        }, 10000);
    }

    private startEnemyLevelInterval(): void {
        if (this.enemyLevelIntervalId !== undefined) {
            clearInterval(this.enemyLevelIntervalId);
        }

        this.enemyLevelIntervalId = setInterval(() => {
            if (!this.isGameOver && this.enemylvl < 6) {
                this.enemylvl += 1;
            }
        }, 20000);
    }

    private gameOver(): void {
        this.isGameOver = true;
        this.clearAllIntervals();

        this.enemies.forEach(enemy => this.gameContainer.removeChild(enemy));
        this.bullets.forEach(bullet => this.gameContainer.removeChild(bullet));

        this.enemies.length = 0;
        this.bullets.length = 0;

        this.app.ticker.stop();

        drawGameOverWithPixi(this.app, this.gameContainer, this.player, this.restartGame.bind(this));
    }

    private clearAllIntervals(): void {
        if (this.enemyIntervalId !== undefined) {
            clearInterval(this.enemyIntervalId);
            this.enemyIntervalId = undefined;
        }
        if (this.gameIntervalId !== undefined) {
            clearInterval(this.gameIntervalId);
            this.gameIntervalId = undefined;
        }
        if (this.enemyLevelIntervalId !== undefined) {
            clearInterval(this.enemyLevelIntervalId);
            this.enemyLevelIntervalId = undefined;
        }
    }

    private restartGame(): void {
        this.enemyInterval = 1000;
        this.isGameOver = false;
        this.enemylvl = 1;

        this.gameContainer.removeChildren();
        this.gameContainer.addChild(this.backgroundSprite);

        this.initPlayer();
        updatePoops(this.player.money);
        updateLives(this.player.lives);
        updateMonstersKilled(this.player.monstersKilled);

        this.enemies.length = 0;
        this.bullets.length = 0;

        this.clearAllIntervals();
        this.startEnemySpawner();
        this.startGameInterval();
        this.startEnemyLevelInterval();
        this.updateStatsBar();

        this.app.ticker.start();
    }

    private updateShopProgressBars(levels: { [type: string]: number }): void {
        const max = 5;
        Object.entries(levels).forEach(([type, level]) => {
            const progressDiv = document.querySelector(`.itemProgress[data-type="${type}"]`);
            if (progressDiv) {
                progressDiv.innerHTML = '';
                for (let i = 0; i < max; i++) {
                    const sq = document.createElement('div');
                    sq.className = 'progressSquare' + (i < level ? ' filled' : '');
                    progressDiv.appendChild(sq);
                }
            }
        });
    }

    private updateStatsBar(): void {
        this.updateShopProgressBars({
            ammo: 0,
            fasterShooting: this.player.ammoSpeed - 20,
            life: this.player.lives - 3,
            upgradeWeapon: 0
        });
    }

    public start(): void {
        this.startEnemySpawner();
        this.startGameInterval();
        this.startEnemyLevelInterval();
        this.updateStatsBar();
        this.app.ticker.add(() => this.gameLoop());
    }

    public getGameState(): object {
        return {
            isGameOver: this.isGameOver,
            enemyLevel: this.enemylvl,
            playerStats: {
                lives: this.player.lives,
                money: this.player.money,
                monstersKilled: this.player.monstersKilled,
                ammos: this.player.ammos
            }
        };
    }

    public destroy(): void {
        this.clearAllIntervals();
        this.app.destroy(true, true);
    }
}

async function main() {
    const game = new Game("canvas");
    await game.init();
    game.start();
}

main();