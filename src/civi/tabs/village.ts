import { Tab } from './tab';
import { Game } from '../game';

export class VillageTab extends Tab {
    constructor(game: Game) {
        super('Village', 'Village');
        this._game = game;
    }

    render(container: HTMLElement): void {
    }
}