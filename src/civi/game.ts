import { UISystem } from './ui/ui';

import { Tab, CivilizationTab, CivicTab } from './tabs/tab' 
import { ResourcesManager } from './managers/resources';
import { BuildingsManager } from './managers/buildings';
import { Console } from './console';

interface Version {
    major: number;
    minor: number;
    build: number;
    revision: number;
}

export class Game {
    public static _instance: Game;
    
    private _ui: UISystem;

    readonly tabs: Tab[]

    // Managers
    readonly res: ResourcesManager;
    readonly bld: BuildingsManager;

    readonly console: Console;

    readonly version: Version

    public constructor() {
        this.tabs = [
            { className: CivilizationTab },
            { className: CivicTab }
        ].map(({ className }) => {
            return new className();
        });

        this.res = new ResourcesManager();
        this.bld = new BuildingsManager();

        this.console = new Console();
        this.console.addMessage('Welcome to Civi');

        this.version = { major: 0, minor: 0, build: 0, revision: 0 };
    }

    public start(): void {
        window.setInterval(() => {
            this.tick();
        })
    }

    public stop(): void {}

    public tick(): void {
        this.update();
    }

    public update(): void {
        for(const tab of this.tabs) {
            tab.update();
        }

        this.res.update();
        this.bld.update();

        this.ui.update();
    }

    public render(): void {
        this._ui.render();
    }

    static get instance(): Game { 
        if(!Game._instance)
            Game._instance = new Game();
        return Game._instance;
    }

    public set ui(ui: UISystem) { this._ui = ui; }
    public get ui(): UISystem { return this._ui; }
}

export const game = Game.instance;