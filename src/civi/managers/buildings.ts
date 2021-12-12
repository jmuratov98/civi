import { Game } from '../game';

export interface Price {
    name: string;
    amount: number;
}

export interface BuildingType {
   name: string;
   label: string;
   description: string;
   unlockRatio: number;
   prices: Price[];
   priceRatio: number;
   effects: Record<string, number>;
   amount: number;
   unlocked: boolean;
}

type BuildingMapType = { [name: string]: BuildingType };

function isUnlockable(bld: BuildingType, game: Game): boolean {
    const { prices, unlockRatio } = bld;
    const res = prices.every(p => game.res.resources[p.name].amount >= p.amount * unlockRatio);
    return res;
}

export class BuildingManager {
    
    static readonly buildingsData = [{
        name: 'farm',
        label: 'Farm',
        description: 'A farm where you can farm some food',
        unlockRatio: 0.3,
        prices: [
            { name: 'food', amount: 10 }
        ],
        priceRatio: 1.12,

        // I don't know how i want to work with the effects
        effects: {
            'foodPerTickBase': 0.125,
        },
    }];

    private _game: Game;

    readonly _buildings: BuildingMapType;
    
    constructor(game: Game) {
        this._game = game;
        this._buildings = {};
        BuildingManager.buildingsData.reduce((bldMap, bld) => {
            bldMap[bld.name] = {
                ...bld,
                amount: 0,
                unlocked: false
            }
            return bldMap;
        }, this._buildings)
    }

    buyBuilding(name: string): void {
        const bld = this._buildings[name];
    }

    update(): void {
        let rerender = false;
        for(const name in this._buildings) {
            const bld = this._buildings[name];
            if(bld.unlocked)
                continue;
            if(isUnlockable(bld, this._game)) {
                bld.unlocked = true;
                rerender = true;
            }
        }

        if(rerender) this._game.render();
    }

    get buildings(): BuildingMapType { return this._buildings; }
}