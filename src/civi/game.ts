import { DesktopUI } from "./ui";
import { Tab, CivilizationTab, VillageTab, ScienceTab, WorkshopTab, DiplomacyTab } from './tabs'
import { ResourceManager } from './managers/resources';
import { BuildingManager } from './managers/buildings';

type HandlerFn<T extends any[]> = (...args: T) => void;

interface ObserverType {
    name: string,
    handler: HandlerFn<any[]>;
}

// TODO: May do other things later
class Observer {
    private _observers: ObserverType[];

    constructor() {
        this._observers = [];
    }

    on<T extends any[]>(name: string, handler: HandlerFn<T>) {
        this._observers.push({ name, handler });
    }

    off(name: string) {
        const index = this._observers.findIndex(observer => observer.name === name);
        if(index === -1)
            return;
        this._observers.splice(index, 1);
    }

    fire(name: string, args: any[]) {
        const observer = this._observers.find(observer => observer.name === name);
        observer.handler.call(undefined, ...args);
    }

}

export class Game {
    private _ui: DesktopUI;
    private _tabs: Tab[];

    // managers
    private _res: ResourceManager;
    private _bld: BuildingManager;

    readonly observer: Observer;

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

        this.observer = new Observer();
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
        if(effectName === 'foodPerTickBase') return 'food per tick';
    }

    get tabs(): Tab[] { return this._tabs; }

    get res(): ResourceManager { return this._res; }
    get bld(): BuildingManager { return this._bld; }
    get effects(): Record<string, number> { return this._effects; }

    get tickrate(): number { return this._ticksPerSecond}
}