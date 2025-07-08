import { Player } from "./Player";
import { showShopAlert } from "../utils/shopAlert"

export class Shop {
    constructor() { }

    buyHealth(player: Player): boolean {
        const cost = 5
        if (player.spendMoney(cost)) {
            player.addLives(1);
            return true;
        }
        showShopAlert("Nie masz środków!")
        return false;
    }

    buySpeed(player: Player): boolean {
        const cost = 1
        if (player.spendMoney(cost)) {
            player.addSpeed(1);
            return true;
        }
        showShopAlert("Nie masz środków!")
        return false;
    }

    buyAmmo(player: Player): boolean {
        const cost = 1
        if (player.spendMoney(cost)) {
            player.addAmmo(50);
            return true;
        }
        showShopAlert("Nie masz środków!")
        return false;
    }


    buyAmmoSpeed(player: Player): boolean {
        const cost = 10
        if (player.spendMoney(cost)) {
            player.addAmmoSpeed(1);
            return true;
        }
        showShopAlert("Nie masz środków!")
        return false;
    }

}