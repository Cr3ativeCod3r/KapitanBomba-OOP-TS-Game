export function updateMonstersKilled(monstersKilled: number) {
    const pointsSpace = document.getElementById("score");
    if (pointsSpace) {
        pointsSpace.textContent = `${monstersKilled}`;
    }
}

export function updateLives(lives: number) {
    const livesSpace = document.getElementById("lives");
    if (livesSpace) {
        if (lives <= 0) {
            livesSpace.innerHTML = '';
        } else {
            livesSpace.innerHTML = Array(lives + 1).join('<img id="hearts" src="images/heart.png" alt="heart">');
        }
    }
}

export function updatePoops(poops: number) {
    const poopSpace = document.getElementById("poop");
    if (poopSpace) {
        poopSpace.textContent = `${poops}`;
    }
}

export function updateAmmo(number: number) {
    const ammoSpace = document.getElementById("ammo");
    if (ammoSpace) {
        ammoSpace.textContent = `${number}`;
    }
}