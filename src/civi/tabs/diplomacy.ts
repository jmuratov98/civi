import { Tab } from "./tab";
import { Game } from "../game";

export class DiplomacyTab extends Tab {
    constructor(game: Game) { 
        super('Diplomacy', 'Diplomacy');
        this._game = game;
    }

    render(container: HTMLElement): void {
    }
}