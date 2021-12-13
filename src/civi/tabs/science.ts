import { Tab } from './tab';
import { Game } from '../game';

export class ScienceTab extends Tab {
    constructor(game: Game) { 
        super('Science', 'Science');
        this._game = game;
    }

    render(container: HTMLElement): void {
    }
}