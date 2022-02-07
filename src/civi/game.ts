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

    public tickRate: number;

    public constructor() {}

    public init(): void {
        this.tabs = [
            { className: CivilizationTab },
            { className: CivicTab }
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

        this.tickRate = 5;
    }

    public start(): void {
        window.setInterval(() => {
            this.tick();
        }, 1000 / this.tickRate);
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
        if(!dataString) {
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
        window.location.reload();
    }

    public set ui(ui: UISystem) { this._ui = ui; }
    public get ui(): UISystem { return this._ui; }

    static get instance(): Game { 
        if(!Game._instance)
            Game._instance = new Game();
        return Game._instance;
    }

    private initEffects(): void {
        // Get all effects from the buildings
        for(const bldName in this.bld.buildings) {
            const effect = this.bld.buildings[bldName].effects;
            for(const effectName in effect) {
                this.effects[effectName] = 0;
            }
        }

        // Gets all base effects
        for(const effectName in this.effectsBase) {
            this.effects[effectName] = this.effectsBase[effectName]
        }
    }

    private updateEffects(): void {
        for(const effectName in this.effects) {
            let effect = 0;
            for(const bldName in this.bld.buildings) {
                const bld = this.bld.buildings[bldName];
                for(const en in bld.effects) {
                    if(effectName == en) {
                        effect += this.bld.getEffect(bld, effectName);
                    }
                }
            }

            if(effectName in this.effectsBase) {
                effect += this.effectsBase[effectName]
            }

            this.effects[effectName] = effect;
        }

    }
}

export const game = Game.instance;