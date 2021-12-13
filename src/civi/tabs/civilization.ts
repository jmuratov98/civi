import { Game } from '../game';
import { Tab } from './tab';
import { Button, BuildingButtonController, FoodButtonController, WoodButtonController, StoneButtonController } from '../ui'

export class CivilizationTab extends Tab {
    public constructor(game: Game) {
        super('Civilization', 'Civilization');
        this._game = game;
        this._visible = true;
    }

    public render(container: HTMLElement): void {
        this._buttons = []
        this.addCoreButtons();

        for (const name in this.game.bld.buildings) {
            const bld = this.game.bld.buildings[name];
            if(bld.unlocked) {
                this._buttons.push(new Button({
                    label: bld.label,
                    controller: new BuildingButtonController(this.game),
                    description: bld.description,
                    model: bld,
                    game: this.game
                }))
            }
        }

        for (let i = 0; i < this._buttons.length; i++)
            this._buttons[i].render(container);
    }

    update(): void {
    }

    private addCoreButtons() {
        this._buttons.push(new Button({
            label: 'Gather Food',
            controller: new FoodButtonController(this.game),
            description: 'Gather some food for the villagers to eat',
            game: this.game
        }))

        this._buttons.push(new Button({
            label: 'Chop Wood',
            controller: new WoodButtonController(this.game),
            description: 'Gather some wood to build buildings',
            game: this.game
        }))

        this._buttons.push(new Button({
            label: 'Mine Stone',
            controller: new StoneButtonController(this.game),
            description: 'Gather some stone to build buildings',
            game: this.game
        }))

    }
}