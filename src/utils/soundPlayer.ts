import { sounds } from "../assets/sounds";


export function playSound(name: keyof typeof sounds) {
    const src = sounds[name].src;
    if (!src) return;
    const audio = new Audio(src);
    audio.currentTime = 0;
    audio.play();
}
