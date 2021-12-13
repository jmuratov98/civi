import { Game } from '../game'
import { fixFloatingPointNumber } from '../utils';

export interface ResourceObjectType {
    name: string;
    label: string;
    amount: number;
    unlocked: boolean;
    //TODO: May change this later
    max: number;
    pertick: number;
}

type ResourceMapType = {
    [name: string]: ResourceObjectType
}

export class ResourceManager {
    static readonly resData = [{
        name: 'food',
        label: 'Food',
        max: 5000
    }, {
        name: 'wood',
        label: 'Wood',
        max: 5000
    }, {
        name: 'stone',
        label: 'Stone',
        max: 5000
    }];

    private _game: Game;

    readonly _resources: ResourceMapType;

    constructor(game: Game) {
        this._game = game;
        this._resources = {};
        ResourceManager.resData.reduce((resMap, res) => {
            resMap[res.name] = {
                ...res,
                amount: 0,
                unlocked: false,
                max: res.max ? res.max : 0,
                pertick: 0
            };
            return resMap;
        }, this._resources);
    }

    update(): void {
        const game = this._game;

        for (const name in this._resources) {
            const res = this._resources[name];

            if(!res.unlocked && res.amount > 0) res.unlocked = true;

            this.increment(res.name, res.pertick);   
            res.amount = fixFloatingPointNumber(res.amount)         
        }
    }

    increment(resName: string, amount: number): void {
        const res = this._resources[resName];
        if(res.amount + amount <= res.max)
            res.amount += amount;
    }

    get resources(): ResourceMapType { return this._resources; }

}