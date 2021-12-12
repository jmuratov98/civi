import { DesktopUI, Button, ButtonController, FoodButtonController, WoodButtonController, StoneButtonController } from "./ui";
import { ResourceManager } from './managers/resources';
import { BuildingManager } from './managers/buildings';

// TODO: Make this class an interface, as this should not be directly instantiated
class Tab {
    private _game: Game;
    private _label: string;
    private _id: string;
    protected _visible: boolean;
    protected _buttons: Button[];

    constructor(label: string, id: string) {
        this._label = label;
        this._id = id;
        this._visible = true;
        this._buttons = [];
    }

    render(container: HTMLElement): void { }

    update() {
        for(let i = 0; i < this._buttons.length; i++) {
            const button = this._buttons[i];
            button.update();
        }
    }

    set game(game: Game) { this._game = game; }
    get game() { return this._game; }

    set visible(enabled: boolean) { this._visible = enabled; }
    get visible() { return this._visible; }

    set label(label: string) { this._label = label; }
    get label() { return this._label; }

    set id(id: string) { this._id = id; }
    get id() { return this._id; }
}

class ForestTab extends Tab {
    public constructor() {
        super('Forest', 'Forest');
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
                    controller: new ButtonController(this.game),
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

export class Game {
    private _ui: DesktopUI;
    private _tabs: Tab[];

    // managers
    private _res: ResourceManager;
    private _bld: BuildingManager;

    private _ticksPerSecond = 5;

    public constructor(ui: DesktopUI) {
        this._ui = ui;
        this._ui.game = this;

        // managers
        this._res = new ResourceManager(this);
        this._bld = new BuildingManager(this);

        this._tabs = [];
        [
            { className: ForestTab },
            { className: Tab, label: 'Village', id: 'Village' },
            { className: Tab, label: 'Workshop', id: 'Workshop' },
            { className: Tab, label: 'Science', id: 'Science' },
        ].forEach(({ className, label, id }) => {
            const tab = new className(label, id)
            this._tabs.push(tab)
            tab.game = this;
        })
    }

    public start(): void {
        window.setInterval(() => {
            this.tick();
        }, 1000 / this._ticksPerSecond);
    }

    private tick(): void {
        this.update();
    }

    private update(): void {
        this._res.update();
        this._bld.update();

        this._ui.update();
    }

    public render(): void {
        this._ui.render();

        this.update();
    }

    get tabs(): Tab[] { return this._tabs; }

    get res(): ResourceManager { return this._res; }
    get bld(): BuildingManager { return this._bld; }

    get tickrate(): number { return this._ticksPerSecond}
}