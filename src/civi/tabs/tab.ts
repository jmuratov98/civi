import { Game } from '../game'
import { Button } from '../ui';

export abstract class Tab {
    protected _game: Game;
    protected _label: string;
    protected _id: string;
    protected _visible: boolean;
    protected _buttons: Button[];

    protected constructor(label: string, id: string) {
        this._label = label;
        this._id = id;
        this._visible = true;
        this._buttons = [];
    }

    abstract render(container: HTMLElement): void;

    update(): void {
        for(let i = 0; i < this._buttons.length; i++) {
            const button = this._buttons[i];
            button.update();
        }
    }

    set game(game: Game) { this._game = game; }
    get game(): Game { return this._game; }

    set visible(enabled: boolean) { this._visible = enabled; }
    get visible(): boolean { return this._visible; }

    set label(label: string) { this._label = label; }
    get label(): string { return this._label; }

    set id(id: string) { this._id = id; }
    get id(): string { return this._id; }
}