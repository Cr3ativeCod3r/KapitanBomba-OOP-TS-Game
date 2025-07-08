import * as PIXI from 'pixi.js';
import { playSound } from '../utils/soundPlayer'

export function drawGameOverWithPixi(
  app: PIXI.Application,
  gameContainer: PIXI.Container,
  player: { monstersKilled: number },
  restartGameCallback: () => void
): void {
  playSound("over");

  const overlay = new PIXI.Graphics();
  overlay.beginFill(0x000000, 0.7);
  overlay.drawRect(0, 0, app.screen.width, app.screen.height);
  overlay.endFill();

  const gameOverText = new PIXI.Text('GAME OVER', {
    fontFamily: 'Arial',
    fontSize: 48,
    fill: 0xffffff,
    align: 'center'
  });
  gameOverText.x = app.screen.width / 2;
  gameOverText.y = app.screen.height / 2 - 100;
  gameOverText.anchor.set(0.5);

  const scoreText = new PIXI.Text(`Monsters Killed: ${player.monstersKilled}`, {
    fontFamily: 'Arial',
    fontSize: 24,
    fill: 0xffffff,
    align: 'center'
  });
  scoreText.x = app.screen.width / 2;
  scoreText.y = app.screen.height / 2 - 50;
  scoreText.anchor.set(0.5);

  const restartButton = new PIXI.Graphics();
  restartButton.beginFill(0x00ff00);
  restartButton.drawRoundedRect(0, 0, 200, 50, 10);
  restartButton.endFill();
  restartButton.x = app.screen.width / 2 - 100;
  restartButton.y = app.screen.height / 2 + 30;
  restartButton.interactive = true;
  restartButton.cursor = 'pointer';

  const restartText = new PIXI.Text('RESTART GAME', {
    fontFamily: 'Arial',
    fontSize: 20,
    fill: 0x000000,
    align: 'center'
  });
  restartText.x = 100;
  restartText.y = 25;
  restartText.anchor.set(0.5);

  restartButton.addChild(restartText);
  restartButton.on('pointerdown', restartGameCallback);

  gameContainer.addChild(overlay);
  gameContainer.addChild(gameOverText);
  gameContainer.addChild(scoreText);
  gameContainer.addChild(restartButton);
}