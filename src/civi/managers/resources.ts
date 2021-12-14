import { Game } from '../game'
import { fixFloatingPointNumber } from '../utils';
import { Manager } from './manager';

export interface ResourceObjectType {
    name: string;
    label: string;
    amount: number;
    unlocked: boolean;
}

type ResourceMapType = {
    [name: string]: ResourceObjectType
}

export class ResourceManager extends Manager {
    static readonly resData = [{
        name: 'food',
        label: 'Food',
    }, {
        name: 'wood',
        label: 'Wood',
    }, {
        name: 'stone',
        label: 'Stone',
    }];

    readonly _resources: ResourceMapType;

    constructor(game: Game) {
        super(game)
        this._resources = {};
        ResourceManager.resData.reduce((resMap, res) => {
            resMap[res.name] = {
                ...res,
                amount: 0,
                unlocked: false,
            };
            return resMap;
        }, this._resources);
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
        if(res.amount + amount <= 5000)
            res.amount += amount;
    }

    private getResourcePerRick(resName: string): number {
        return this._game.getEffect(resName + 'PerTickBase')
    }

    get resources(): ResourceMapType { return this._resources; }

}