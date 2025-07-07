export const sounds = {
    shot: new Audio(),
    okrzyk: new Audio(),
    over: new Audio(),
};

const prefix = "dist/sounds/"

sounds.shot.src = prefix + "shot.mp3";
sounds.okrzyk.src = prefix + "krzykBomba.mp3";
sounds.over.src = prefix + "over.mp3";