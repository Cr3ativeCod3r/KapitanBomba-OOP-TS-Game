// class Game{

//     constructor
// }





// import { Player } from "./models/Player";
// import { Bullet } from "./models/Bullet";
// import { Enemy } from "./models/Enemy";

// import { images } from "./assets/images";

// import { playerKey } from "./utils/control"
// import { playSound } from "./utils/soundPlayer";

// import { updateMonstersKilled } from "./utils/achievements"
// import { updateLives, updatePoops } from "./utils/achievements"

// import { drawGameOverScreen, restartButton } from "./scenes/gameOver";

// const canvas = document.getElementById("canvas") as HTMLCanvasElement;
// const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

// const bullets: Array<Bullet> = []
// const enemies: Array<Enemy> = []


// let player: Player;
// let enemyInterval = 2000;
// let enemyIntervalId: number | undefined;
// let gameIntervalId: number | undefined;
// let isGameOver = false;
// let enemyW = 100
// let enemyH = 100

// function initPlayer() {
//     player = new Player(
//         200,
//         200,
//         120,
//         120,
//         images.player,
//         5,
//         3
//     );
//     updateLives(player.lives)
//     updateMonstersKilled(player.monstersKilled)
// }



// function gameLoop() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     if (isGameOver) {
//         playSound("over")
//         drawGameOverScreen(ctx, canvas, player.monstersKilled)
//         return;
//     }
//     player.control(playerKey);
//     player.draw(ctx);
//     player.checkCollisionBounds(canvas)

//     for (let i = enemies.length - 1; i >= 0; i--) {
//         let enemy = enemies[i];
//         enemy.move();
//         enemy.draw(ctx);
//         if (enemy.x + enemy.w < 0) {
//             enemies.splice(i, 1);
//         }
//     }
//     for (let i = bullets.length - 1; i >= 0; i--) {
//         if (!bullets[i].isOnScreen(canvas)) {
//             bullets.splice(i, 1);
//         }
//     }
//     for (const bullet of bullets) {
//         bullet.move();
//         bullet.draw(ctx);
//     }

//     enemyCollisions()
//     requestAnimationFrame(gameLoop);
// }



// function startEnemySpawner() {
//     if (enemyIntervalId !== undefined) {
//         clearInterval(enemyIntervalId);
//     }
//     enemyIntervalId = setInterval(() => {
//         if (!isGameOver) {
//             spawnEnemy();
//         }
//     }, enemyInterval);
// }

// function spawnEnemy() {
//     const randomY = Math.random() * (canvas.height - enemyH);
//     enemies.push(
//         new Enemy(
//             canvas.width - enemyW,
//             randomY,
//             enemyW,
//             enemyH,
//             images.enemyKurvinox,
//             5,
//             1,
//             1
//         )
//     );
// }

// function enemyCollisions() {
//     for (let i = enemies.length - 1; i >= 0; i--) {
//         let enemy = enemies[i];

//         if (enemy) onEnemyTouch(enemy, i)

//         for (let j = bullets.length - 1; j >= 0; j--) {
//             let bullet = bullets[j];
//             let bulletCenter = bullet.y + (bullet.h / 2);
//             if (
//                 bullet.x + bullet.w >= enemy.x &&
//                 bullet.x + bullet.w <= enemy.x + enemy.w &&
//                 bulletCenter >= enemy.y &&
//                 bulletCenter <= enemy.y + enemy.h
//             ) {

//                 if (enemies[i]) {
//                     enemies[i].damage = 0
//                     enemies[i].speed = 0
//                     enemies[i].image = images.poop
                    
//                     console.log( player.monstersKilled )
                 
//                 }
//                 if (enemy.damage > 0) {
//                     bullets.splice(j, 1);
//                     // player.monstersKilled += 1
//                     // console.log(updateMonstersKilled)
//                     // updateMonstersKilled(player.monstersKilled)
//                     enemies.splice(i, 1);

//                        player.monstersKilled += 1
//                     updateMonstersKilled(player.monstersKilled)
//                 }
//                 break;
//             }
//         }
//     }
// }
// function onEnemyTouch(enemy: Enemy, i: number) {
//     if (
//         player.x + (player.w / 2) >= enemy.x &&
//         player.x < enemy.x &&
//         player.y <= enemy.y + enemy.h &&
//         player.y + player.h >= enemy.y
//     ) {

//         // collect poop
//         if (enemy.damage == 0) {
//             player.money += 1
//             updatePoops(player.money)
//             enemies.splice(i, 1);
//         } else {   // enemy hit you 
//             player.lives -= enemy.damage
//             updateLives(player.lives)
//         }

//         if (player.lives <= 0) {
//             gameOver();
//             return;
//         }
//     }
// }

// function startGameInterval() {
//     if (gameIntervalId !== undefined) {
//         clearInterval(gameIntervalId);
//     }
//     gameIntervalId = setInterval(() => {
//         if (!isGameOver && enemyInterval > 200) {
//             enemyInterval = Math.max(200, enemyInterval - 200);
//             startEnemySpawner();
//         }
//     }, 10000);
// }

// function gameOver() {
//     isGameOver = true;
//     if (enemyIntervalId !== undefined) {
//         clearInterval(enemyIntervalId);
//         enemyIntervalId = undefined;
//     }
//     if (gameIntervalId !== undefined) {
//         clearInterval(gameIntervalId);
//         gameIntervalId = undefined;
//     }
//     enemies.length = 0;
//     bullets.length = 0;
// }

// function restartGame() {
//     enemyInterval = 2000;
//     isGameOver = false;

    

//     initPlayer();
//     updatePoops(player.money);
//     updateLives(player.lives);
//     updateMonstersKilled(player.monstersKilled);

//     enemies.length = 0;
//     bullets.length = 0;

//     startEnemySpawner();
//     startGameInterval();

//     gameLoop();
// }


// canvas.addEventListener("click", function (e) {
//     if (!isGameOver) return;

//     const rect = canvas.getBoundingClientRect();
//     const mouseX = e.clientX - rect.left;
//     const mouseY = e.clientY - rect.top;

//     if (
//         mouseX >= restartButton.x &&
//         mouseX <= restartButton.x + restartButton.w &&
//         mouseY >= restartButton.y &&
//         mouseY <= restartButton.y + restartButton.h
//     ) {
//         restartGame();
//     }
// });

// let fireKeyDownTime: number | null = null;
// let fireKeyHeldTimeout: number | null = null;

// window.addEventListener("keydown", (e) => {
//     if (e.key.toLowerCase() === "e" && !isGameOver) {
//         if (fireKeyDownTime === null) {
//             fireKeyDownTime = Date.now();
//             fireKeyHeldTimeout = window.setTimeout(() => {
//                 playSound("okrzyk");
//             }, 1000);
//         }
//         playSound("shot");
//         let bullet = player.fire() as Bullet;
//         bullets.push(bullet);
//     }
// });

// window.addEventListener("keyup", (e) => {
//     if (e.key.toLowerCase() === "e") {
//         fireKeyDownTime = null;
//         if (fireKeyHeldTimeout !== null) {
//             clearTimeout(fireKeyHeldTimeout);
//             fireKeyHeldTimeout = null;
//         }
//     }
// });


// initPlayer();
// startEnemySpawner();
// startGameInterval();
// gameLoop();