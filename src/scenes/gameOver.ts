export const restartButton = {
    x: 0,
    y: 0,
    w: 300,
    h: 60
};

export function drawGameOverScreen(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, points: number) {
    ctx.save();
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();


    ctx.fillStyle = "#fff";
    ctx.font = "bold 64px Arial";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER!", canvas.width / 2, canvas.height / 2 - 60);


    ctx.font = "bold 32px Arial";
    ctx.fillText(`Ustrzelone kurwinoxy: ${points}`, canvas.width / 2, canvas.height / 2 - 10);


    restartButton.x = canvas.width / 2 - restartButton.w / 2;
    restartButton.y = canvas.height / 2 + 30;


    ctx.fillStyle = "yellow";
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 4;
    ctx.fillRect(restartButton.x, restartButton.y, restartButton.w, restartButton.h);
    ctx.strokeRect(restartButton.x, restartButton.y, restartButton.w, restartButton.h);

    ctx.fillStyle = "#222";
    ctx.font = "bold 32px Arial";
    ctx.fillText("start", canvas.width / 2, restartButton.y + restartButton.h / 2 + 12);
}