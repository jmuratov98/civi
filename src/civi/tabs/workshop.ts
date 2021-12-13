import { Tab } from './tab';
import { Game } from '../game';

export class WorkshopTab extends Tab {
    constructor(game: Game) { 
        super('Workshop', 'Workshop');
        this._game = game;
    }

    render(container: HTMLElement): void {
    }
}