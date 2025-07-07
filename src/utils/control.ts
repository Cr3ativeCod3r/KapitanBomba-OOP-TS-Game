export let playerKey = "none";

const keysDown = new Set<string>();

const keyMap: Record<string, string> = {
    "ArrowLeft": "left",
    "a": "left",
    "A": "left",
    
    "ArrowRight": "right",
    "d": "right",
    "D": "right",

    "ArrowUp": "up",
    "w": "up",
    "W": "up",

    "ArrowDown": "down",
    "s": "down",
    "S": "down"
};

document.addEventListener("keydown", function(event) {
    if (keyMap[event.key]) {
        keysDown.add(event.key);
        playerKey = keyMap[event.key];
    }
});

document.addEventListener("keyup", function(event) {
    if (keyMap[event.key]) {
        keysDown.delete(event.key);
        let found = false;
        for (const key of keysDown) {
            if (keyMap[key]) {
                playerKey = keyMap[key];
                found = true;
                break;
            }
        }
        if (!found) {
            playerKey = "none";
        }
    }
});

