import { DesktopUI } from "./ui";
import { Tab, CivilizationTab, VillageTab, ScienceTab, WorkshopTab, DiplomacyTab } from './tabs'
import { ResourceManager } from './managers/resources';
import { BuildingManager } from './managers/buildings';

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
            { className: CivilizationTab },
            { className: VillageTab },
            { className: ScienceTab },
            { className: WorkshopTab },
            { className: DiplomacyTab },
        ].forEach(({ className }) => {
            const tab = new className(this)
            this._tabs.push(tab)
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