import { Game, ResourceSaveData } from '../game'
import { fixFloatingPointNumber } from '../utils';
import { Manager } from './manager';

export interface ResourceObjectType {
    name: string;
    label: string;
    amount?: number;
    unlocked?: boolean;
}

type ResourceMapType = {
    [name: string]: ResourceObjectType
}

export class ResourceManager extends Manager {
    static readonly resData: ResourceObjectType[] = [{
        name: 'food',
        label: 'Food',
    }, {
        name: 'wood',
        label: 'Wood',
    }, {
        name: 'stone',
        label: 'Stone',
    }, {
        name: 'villagers',
        label: 'Villagers'
    }, {
        name: 'ore',
        label: 'Ore'
    }];

    readonly _resources: ResourceMapType;

    constructor(game: Game) {
        super(game)
        this._resources = {};
        for(let i = 0; i < ResourceManager.resData.length; i++) {
            const res = ResourceManager.resData[i]
            res.amount = 0;
            res.unlocked = false
            this._resources[res.name] = res;
        }
    }

    update(): void {
        for (const name in this._resources) {
            const res = this._resources[name];

            if(!res.unlocked && res.amount > 0) res.unlocked = true;

            const pertick = this.getResourcePerRick(name);
            this.increment(res.name, pertick);   
            res.amount = fixFloatingPointNumber(res.amount)         
        }
    }

    increment(resName: string, amount: number): void {
        const res = this._resources[resName];
        if(res.amount + amount <= this._game.getEffect(res.name + 'Max'))
            res.amount += amount;
    }

    public save(): ResourceSaveData[] {
        const resources: ResourceSaveData[] = [];
        for(let i = 0; i < ResourceManager.resData.length; i++) {
            const res = ResourceManager.resData[i];
            console.log(res);
            const saveRes: ResourceSaveData = {
                name: res.name,
                amount: res.amount,
                unlocked: res.unlocked
            }
            resources.push(saveRes);
        }
        return resources;
    }

    public load(resources: ResourceSaveData[]): void {
        for(let i = 0; i < resources.length; i++) {
            const res = resources[i];
            this._resources[res.name].amount = res.amount
            this._resources[res.name].unlocked = res.unlocked
        }
    }

    private getResourcePerRick(resName: string): number {
        return this._game.getEffect(resName + 'PerTickBase')
    }

    get resources(): ResourceMapType { return this._resources; }

}