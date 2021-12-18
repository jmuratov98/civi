import { DesktopUI } from "./ui";
import { Tab, CivilizationTab, VillageTab, ScienceTab, WorkshopTab, DiplomacyTab } from './tabs'
import { ResourceManager } from './managers/resources';
import { BuildingManager } from './managers/buildings';

class Console {
    private _game: Game;

    private _messages: string[]; // TODO: A message should have more data allocated to it, like date/year

    constructor(game: Game) {
        this._game = game;
        this._messages = [];
    }

    public pushMessage(message: string): void {
        this._messages.unshift(message);
        this._game.render();
    }

    public clear(): void {
        this._messages = [];
        this._game.render();
    }

    public renderMessage(container: HTMLElement, message: string): void {
        const msg = document.createElement('span');
        msg.className = 'message';
        msg.innerText = message;
        container.appendChild(msg);
    }

    get messages(): string[] { return this._messages; }
}

export type ResourceSaveData = {
    name: string,
    amount: number,
    unlocked: boolean
}

export type BuildingSaveData = {
    name: string,
    amount: number,
    unlocked: boolean
}

type SaveData = {
    resources: ResourceSaveData[],
    buildings: BuildingSaveData[],
}

export class Game {
    private _ui: DesktopUI;
    private _tabs: Tab[];

    // managers
    private _res: ResourceManager;
    private _bld: BuildingManager;

    private _console: Console;

    private _effects: Record<string, number>;

    private _ticksPerSecond = 5;

    public constructor(ui: DesktopUI) {
        this._ui = ui;
        this._ui.game = this;

        // managers
        this._res = new ResourceManager(this);
        this._bld = new BuildingManager(this);

        this._tabs = [];
        [
            { className: CivilizationTab },
            { className: VillageTab },
            { className: ScienceTab },
            { className: WorkshopTab },
            { className: DiplomacyTab },
        ].forEach(({ className }) => {
            const tab = new className(this)
            this._tabs.push(tab)
        })

        this._effects = {};

        this._console = new Console(this);
        this._console.pushMessage('Welcome to civi'); // Change this to have the civilizations name
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

        this.updateEffects();

        this._ui.update();
    }

    public render(): void {
        this._ui.render();

        this.update();
    }

    public getEffect(effectName: string): number {
        return this._effects[effectName] || 0;
    }

    public updateEffects(): void {
        this._effects = {};

        this.bld.updateEffectsCached();
    }

    public stringifyEffect(effectName: string): string { 
        if(effectName === 'foodPerTickBase') return 'Food per tick';
        if(effectName === 'villagersMax') return 'Max villagers';
        if(effectName === 'scienceMax') return 'Max science';
        if(effectName === 'scienceRatio') return 'Science bonus';
    }

    public save(): void {
        const saveData: SaveData = {
            resources: this.res.save(),
            buildings: this.bld.save()
        };

        const saveDataString = JSON.stringify(saveData);
        window.localStorage.setItem('civi.savedata', saveDataString);
    }

    public load(): void {
        const dataString: string = window.localStorage.getItem('civi.savedata');
        if(!dataString) 
            return;
            
        const { resources, buildings} = JSON.parse(dataString);
        this.res.load(resources);
        this.bld.load(buildings);
    }

    public wipe(): void {
        window.localStorage.removeItem('civi.savedata');
        window.location.reload();
    }

    public unlock(unlocks: Record<string, string[]>): void {
        if(unlocks.tabs) {
            const { tabs: tabsNames } = unlocks;
            for(let i = 0; i < tabsNames.length; i++) {
                const tabName = tabsNames[i];

                const tabIndex = this._tabs.findIndex(tab => tab.id === tabName);
                const tab = this._tabs[tabIndex];
                if(tab.visible)
                    continue;
                tab.visible = true;
                
            }
        }
    }

    get tabs(): Tab[] { return this._tabs; }

    get res(): ResourceManager { return this._res; }
    get bld(): BuildingManager { return this._bld; }
    get effects(): Record<string, number> { return this._effects; }
    
    get console(): Console { return this._console; }

    get tickrate(): number { return this._ticksPerSecond}
}