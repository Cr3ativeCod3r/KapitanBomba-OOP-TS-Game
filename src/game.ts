import { Player } from "./models/Player";
import { Bullet } from "./models/Bullet";
import { Shop } from "./models/Shop";
import { Enemy } from "./models/Enemy";
import { images } from "./assets/images";
import { playerKey } from "./utils/control"
import { playSound } from "./utils/soundPlayer";
import { updateMonstersKilled } from "./utils/achievements"
import { updateLives, updatePoops, updateAmmo } from "./utils/achievements"
import { drawGameOverScreen, restartButton } from "./scenes/gameOver";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const bullets: Array<Bullet> = []
const enemies: Array<Enemy> = []

let player: Player;
let enemyInterval = 1000;
let enemyIntervalId: number | undefined;
let gameIntervalId: number | undefined;
let isGameOver = false;
let enemyW = 100
let enemyH = 100
let correctionImages = 50;
let enemylvl = 1
let enemyLevelIntervalId: number | undefined;

function initPlayer() {
    player = new Player(
        200,
        200,
        120,
        120,
        images.player,
        5,
        3
    );
    updateLives(player.lives)
    updateAmmo(player.ammos)
    updateMonstersKilled(player.monstersKilled)
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Rysuj tło galaktyki z 50% przezroczystością
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.drawImage(images.galaktyka, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    if (isGameOver) {
        playSound("over")
        drawGameOverScreen(ctx, canvas, player.monstersKilled)
        return;
    }
    player.control(playerKey);
    player.draw(ctx);
    player.checkCollisionBounds(canvas)

    for (let i = enemies.length - 1; i >= 0; i--) {
        let enemy = enemies[i];
        enemy.move();
        enemy.draw(ctx);
        if (enemy.x + enemy.w < 0) {
            enemies.splice(i, 1);
        }
    }
    for (let i = bullets.length - 1; i >= 0; i--) {
        if (!bullets[i].isOnScreen(canvas)) {
            bullets.splice(i, 1);
        }
    }
    for (const bullet of bullets) {
        bullet.move();
        bullet.draw(ctx);
    }

    enemyCollisions()
    requestAnimationFrame(gameLoop);
}

function startEnemySpawner() {
    if (enemyIntervalId !== undefined) {
        clearInterval(enemyIntervalId);
    }
    enemyIntervalId = setInterval(() => {
        if (!isGameOver) {
            spawnEnemy();
        }
    }, enemyInterval);
}

function spawnEnemy() {
    const randomY = Math.random() * (canvas.height - enemyH);
    enemies.push(
        new Enemy(
            canvas.width - enemyW,
            randomY,
            enemyW,
            enemyH,
            images.enemyKurvinox,
            1,
            enemylvl,
            1
        )
    );
}

function enemyCollisions() {
    // Sprawdź kolizje gracz-wróg
    for (let i = enemies.length - 1; i >= 0; i--) {
        let enemy = enemies[i];

        if (checkPlayerEnemyCollision(enemy)) {
            if (enemy.damage === 0) {
                // Zbierz kupę
                player.money += 1;
                updatePoops(player.money);
                enemies.splice(i, 1);
            } else {
                // Wróg zadaje obrażenia
                player.lives -= enemy.damage;
                updateLives(player.lives);
                enemies.splice(i, 1);

                if (player.lives <= 0) {
                    gameOver();
                    return;
                }
            }
        }
    }

    // Sprawdź kolizje pocisk-wróg
    for (let i = bullets.length - 1; i >= 0; i--) {
        let bullet = bullets[i];
        let bulletHitEnemy = false;

        for (let j = enemies.length - 1; j >= 0; j--) {
            let enemy = enemies[j];

            if (checkBulletEnemyCollision(bullet, enemy)) {
                enemy.lives -= 1
                if (enemy.damage > 0) {
                    // Tylko żywi wrogowie blokują pociski
                    bulletHitEnemy = true;
                    if (enemy.lives == 0) {
                        // Sprawdź czy wróg ma zostać zamieniony na kupę (20% szans)
                        if (Math.random() < 0.2) {
                            enemy.damage = 0;
                            enemy.speed = 0;
                            enemy.image = images.poop;
                        } else {
                            // Usuń wroga i zwiększ licznik zabitych potworów
                            enemies.splice(j, 1);
                            player.monstersKilled += 1;
                            updateMonstersKilled(player.monstersKilled);
                        }
                        break; // Pocisk może trafić tylko jednego wroga
                    }

                }
                // Jeśli enemy.damage = 0 (kupa), pocisk przelatuje przez nią
            }
        }

        // Usuń pocisk jeśli trafił wroga
        if (bulletHitEnemy) {
            bullets.splice(i, 1);
        }
    }
}

function checkPlayerEnemyCollision(enemy: Enemy): boolean {
    return (
        player.x < enemy.x + enemy.w - correctionImages &&
        player.x + player.w > enemy.x + correctionImages &&
        player.y < enemy.y + enemy.h &&
        player.y + player.h > enemy.y
    );
}

function checkBulletEnemyCollision(bullet: Bullet, enemy: Enemy): boolean {
    return (
        bullet.x < enemy.x + enemy.w &&
        bullet.x + bullet.w > enemy.x &&
        bullet.y < enemy.y + enemy.h &&
        bullet.y + bullet.h > enemy.y
    );
}

function startGameInterval() {
    if (gameIntervalId !== undefined) {
        clearInterval(gameIntervalId);
    }
    gameIntervalId = setInterval(() => {
        if (!isGameOver && enemyInterval > 200) {
            enemyInterval = Math.max(200, enemyInterval - 25);
            startEnemySpawner();
        }
    }, 10000);
}

function startEnemyLevelInterval() {
    if (enemyLevelIntervalId !== undefined) {
        clearInterval(enemyLevelIntervalId);
    }
    enemyLevelIntervalId = setInterval(() => {
        if (!isGameOver && enemylvl < 6) {
            enemylvl += 1;
        }
    }, 20000);
}

function gameOver() {
    isGameOver = true;
    if (enemyIntervalId !== undefined) {
        clearInterval(enemyIntervalId);
        enemyIntervalId = undefined;
    }
    if (gameIntervalId !== undefined) {
        clearInterval(gameIntervalId);
        gameIntervalId = undefined;
    }
    if (enemyLevelIntervalId !== undefined) {
        clearInterval(enemyLevelIntervalId);
        enemyLevelIntervalId = undefined;
    }
    enemies.length = 0;
    bullets.length = 0;
}

function restartGame() {
    enemyInterval = 2000;
    isGameOver = false;
    enemylvl = 1;

    initPlayer();
    updatePoops(player.money);
    updateLives(player.lives);
    updateMonstersKilled(player.monstersKilled);

    enemies.length = 0;
    bullets.length = 0;

    if (enemyLevelIntervalId !== undefined) {
        clearInterval(enemyLevelIntervalId);
        enemyLevelIntervalId = undefined;
    }

    startEnemySpawner();
    startGameInterval();
    startEnemyLevelInterval();

    gameLoop();
}

canvas.addEventListener("click", function (e) {
    if (!isGameOver) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (
        mouseX >= restartButton.x &&
        mouseX <= restartButton.x + restartButton.w &&
        mouseY >= restartButton.y &&
        mouseY <= restartButton.y + restartButton.h
    ) {
        restartGame();
    }
});

let fireKeyDownTime: number | null = null;
let fireKeyHeldTimeout: number | null = null;

window.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "e" && !isGameOver) {
        if (fireKeyDownTime === null) {
            fireKeyDownTime = Date.now();
            fireKeyHeldTimeout = window.setTimeout(() => {
                playSound("okrzyk");
            }, 1000);
        }
        playSound("shot");

        const bulletsToAdd = player.fire();
        for (const bullet of bulletsToAdd) {
            bullets.push(bullet);
        }
    }
});

window.addEventListener("keyup", (e) => {
    if (e.key.toLowerCase() === "e") {
        fireKeyDownTime = null;
        if (fireKeyHeldTimeout !== null) {
            clearTimeout(fireKeyHeldTimeout);
            fireKeyHeldTimeout = null;
        }
    }
});

let shop: Shop;

function initShop() {
    shop = new Shop
}

document.querySelectorAll<HTMLButtonElement>('.shopItem[data-type]').forEach(btn => {
    btn.addEventListener('click', () => {
        const type = btn.getAttribute('data-type');
        if (type) {
            handleShopClick(type);
        }
    });
});

function handleShopClick(type: string) {
    switch (type) {
        case 'ammo':
            shop.buyAmmo(player)
            updateAmmo(player.ammos)
            break
        case 'fasterShooting':
            shop.buyAmmoSpeed(player)
            break;
        case 'life':
            shop.buyHealth(player)
            updateLives(player.lives)
            break;
        case 'upgradeWeapon':

            break;
    }
    updatePoops(player.money)
    updateStatsBar()
}

function updateShopProgressBars(levels: { [type: string]: number }) {
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

function updateStatsBar() {
    updateShopProgressBars({
        ammo: 0,
        fasterShooting: player.ammoSpeed - 20,
        life: player.lives - 3,
        upgradeWeapon: 0
    });

}

initPlayer();
initShop();
startEnemySpawner();
startGameInterval();
startEnemyLevelInterval();
gameLoop();
updateStatsBar()




