import { BuildingSaveData, Game } from '../game';
import { fixFloatingPointNumber } from '../utils';
import { Manager } from './manager';

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
   amount?: number;
   unlocked?: boolean;
}

type BuildingMapType = { [name: string]: BuildingType };

function isUnlockable(bld: BuildingType, game: Game): boolean {
    const { prices, unlockRatio } = bld;
    const res = prices.every(p => game.res.resources[p.name].amount >= p.amount * unlockRatio);
    return res;
}

export class BuildingManager extends Manager {
    
    static readonly buildingsData: BuildingType[] = [{
        name: 'farm',
        label: 'Farm',
        description: 'A farm where you can farm some food',
        unlockRatio: 0.3,
        prices: [
            { name: 'food', amount: 10 }
        ],
        priceRatio: 1.12,
        effects: {
            'foodPerTickBase': 0.125,
        },
    }];

    readonly _buildings: BuildingMapType;
    
    constructor(game: Game) {
        super(game);
        this._buildings = {};
        for(let i = 0; i < BuildingManager.buildingsData.length; i++) {
            const bld = BuildingManager.buildingsData[i]
            bld.amount = 0;
            bld.unlocked = false;
            this._buildings[bld.name] = bld;
        }
        this.initializeMeta(BuildingManager.buildingsData, {
            getEffect: function(bld: BuildingType, effectName: string) {
                return bld.effects[effectName] * bld.amount;
            }
        });
        this.initEffectCached();
    }

    public buyBuilding(name: string): void {
        const bld = this._buildings[name];
        const res = bld.prices.every((p: Price) => this._game.res.resources[p.name].amount >= this.getTotalPrice(bld, p))
        if(res) {
            bld.prices.forEach((p: Price): void => {
                this._game.res.resources[p.name].amount -= this.getTotalPrice(bld, p)
            })
            bld.amount++;
        }
    }

    public getTotalPrice({ priceRatio, amount }: BuildingType, price: Price): number { 
        return fixFloatingPointNumber(price.amount * Math.pow(priceRatio, amount));
    }

    public update(): void {
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

    public save(): BuildingSaveData[] {
        const buildings: BuildingSaveData[] = [];
        for(let i = 0; i < BuildingManager.buildingsData.length; i++) {
            const bld = BuildingManager.buildingsData[i];
            const saveBld = {
                name: bld.name,
                amount: bld.amount,
                unlocked: bld.unlocked
            }
            buildings.push(saveBld);
        }
        return buildings;
    }

    public load(buildings: BuildingSaveData[]): void {
        for(let i = 0; i < buildings.length; i++) {
            const bld = buildings[i];
            this._buildings[bld.name].amount = bld.amount;
            this._buildings[bld.name].unlocked = bld.unlocked;
        }
    }

    get buildings(): BuildingMapType { return this._buildings; }
}