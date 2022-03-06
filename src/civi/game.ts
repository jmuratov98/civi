import { UISystem } from './ui/ui';

import { Tab, CivilizationTab, CivicTab } from './tabs/tab'
import { ResourcesManager } from './managers/resources';
import { BuildingsManager } from './managers/buildings';
import { Console } from './console';
import { $I } from './i18n';

interface Version {
    major: number;
    minor: number;
    build: number;
    revision: number;
}

export interface SaveDataInfo {
    name: string;
    amount: number;
    unlocked: boolean;
}

interface SaveData {
    resources: SaveDataInfo[]
    buildings: SaveDataInfo[]
}

export interface KeyBind {
    alt: boolean,
    ctrl: boolean,
    shift: boolean,
    meta: boolean,
    key: string,
    type: string,
    name: string,
    description: string;
    action: () => void;
}

interface CiviOptions {
    keybinds: KeyBind[]
}

export type Effects = Record<string, number>;

export class Game {
    public static _instance: Game;

    private _ui: UISystem;

    public tabs: Tab[]

    // Managers
    public res: ResourcesManager;
    public bld: BuildingsManager;

    public console: Console;

    public version: Version;

    // Effects
    public effects: Effects;
    public effectsBase: Effects;

    public options: CiviOptions;

    public tickRate: number;

    public constructor() { }

    public init(): void {
        this.tabs = [
            { className: CivilizationTab },
            { className: CivicTab },
        ].map(({ className }) => {
            return new className();
        });

        this.res = new ResourcesManager();
        this.bld = new BuildingsManager();

        this.console = new Console();
        this.console.addMessage($I('game.welcome'));

        this.version = { major: 0, minor: 0, build: 0, revision: 0 };

        this.effects = {};
        this.effectsBase = {
            foodMax: 1000,
            woodMax: 1000,
            stoneMax: 1000,

            oreMax: 100
        }
        this.initEffects();

        this.options = {
            keybinds: [
                {
                    alt: false,
                    ctrl: false,
                    shift: false,
                    meta: false,
                    key: 's',
                    type: 'settings',
                    name: 'settings',
                    description: $I('options.keybind.settings'),
                    action: game.toggleOptions
                },
                {
                    alt: true,
                    ctrl: false,
                    shift: false,
                    meta: false,
                    key: '/',
                    type: 'settings',
                    name: 'hotkeys',
                    description: $I('options.keybind.hotkeys'),
                    action: game.toggleHotkeys
                },
                {
                    alt: true,
                    ctrl: false,
                    shift: false,
                    meta: false,
                    key: '1',
                    type: 'navigation',
                    name: 'civilization',
                    description: $I('options.keybind.civilization'),
                    action: () => this.changeTab('civilization')
                }, {
                    alt: true,
                    ctrl: false,
                    shift: false,
                    meta: false,
                    key: '2',
                    type: 'navigation',
                    name: 'civic',
                    description: $I('options.keybind.civic'),
                    action: () => this.changeTab('civic')
                }, {
                    alt: true,
                    ctrl: false,
                    shift: false,
                    meta: false,
                    key: 'ArrowLeft',
                    type: 'navigation',
                    name: 'civic',
                    description: $I('options.keybind.arrowleft'),
                    action: () => this.move('left'),
                }, {
                    alt: true,
                    ctrl: false,
                    shift: false,
                    meta: false,
                    key: 'ArrowRight',
                    type: 'navigation',
                    name: 'civic',
                    description: $I('options.keybind.arrowright'),
                    action: () => this.move('right')
                }
            ]
        }

        this.tickRate = 5;
    }

    public start(): void {
        window.setInterval(() => {
            this.tick();
        }, 1000 / this.tickRate);
    }

    public stop(): void { }

    public tick(): void {
        this.update();
    }

    public update(): void {
        for (const tab of this.tabs) {
            tab.update();
        }

        this.res.update();
        this.bld.update();

        this.updateEffects();

        this.ui.update();
    }

    public render(): void {
        this._ui.render();
    }

    public getEffect(name: string): number {
        return this.effects[name] || 0
    }

    public save(): void {
        const saveData: SaveData = {
            resources: this.res.save(),
            buildings: this.bld.save()
        }

        console.log('saving...');
        this.console.addMessage($I('game.save'))
        const stringified = JSON.stringify(saveData);
        window.localStorage.setItem('civi.savedata', stringified);
    }

    public load(): void {
        const dataString = window.localStorage.getItem('civi.savedata');
        if (!dataString) {
            console.info("Didn't load anything from local storage, creating new game")
            return;
        }

        this.console.addMessage($I('game.load'));
        const { resources, buildings } = JSON.parse(dataString);

        this.res.load(resources);
        this.bld.load(buildings);
    }

    public wipe(): void {
        window.localStorage.removeItem('civi.savedata');
        window.localStorage.removeItem('civi.language');
        // TODO: reset the game options as well
        window.location.reload();
    }

    public toggleOptions(): void {
        const dom = document.getElementById('options-modal');
        dom.classList.toggle('is-active');
    }

    public toggleHotkeys(): void {
        const dom = document.getElementById('hotkeys-modal');
        dom.classList.toggle('is-active');
    }

    public unlocks(unlocks: Record<string, string[]>): void {
        if(unlocks.tabs) {
            const { tabs: tabNames } = unlocks;
            for(let i = 0; i < tabNames.length; i++) {
                const tabName = tabNames[i];
                const tab = this.tabs.find(tab => tab.id == tabName);
            
                if(!tab.visible)
                    tab.visible = true; 
            }
        }
    }

    public set ui(ui: UISystem) { this._ui = ui; }
    public get ui(): UISystem { return this._ui; }

    static get instance(): Game {
        if (!Game._instance)
            Game._instance = new Game();
        return Game._instance;
    }

    private initEffects(): void {
        // Get all effects from the buildings
        for (const bldName in this.bld.buildings) {
            const effect = this.bld.buildings[bldName].effects;
            for (const effectName in effect) {
                this.effects[effectName] = 0;
            }
        }

        // Gets all base effects
        for (const effectName in this.effectsBase) {
            this.effects[effectName] = this.effectsBase[effectName]
        }
    }

    private updateEffects(): void {
        for (const effectName in this.effects) {
            let effect = 0;
            for (const bldName in this.bld.buildings) {
                const bld = this.bld.buildings[bldName];
                for (const en in bld.effects) {
                    if (effectName == en) {
                        effect += this.bld.getEffect(bld, effectName);
                    }
                }
            }

            if (effectName in this.effectsBase) {
                effect += this.effectsBase[effectName]
            }

            this.effects[effectName] = effect;
        }
    }

    private changeTab(id: string) {
        const res = game.tabs.find(tab => tab.id === id);
        if(res.visible) {
            game.ui.activeTab = id;
        }
    }

    private move(direction: string) {
        const id = game.ui.activeTab
        const filteredTabs = game.tabs.filter(tab => tab.visible)
        let res = filteredTabs.findIndex(tab => tab.id === id);
        
        if(direction === 'left') res = (((res - 1) % filteredTabs.length) + filteredTabs.length) % filteredTabs.length;
        if(direction === 'right') res = (res + 1) % filteredTabs.length;
        
        game.ui.activeTab = filteredTabs[res].id;
    }
}

export const game = Game.instance;