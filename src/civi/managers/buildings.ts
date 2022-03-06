import { game, SaveDataInfo } from '../game';
import { $I } from '../i18n';
import { fixFloatingPoint } from '../utils';
import { Manager } from './managers';

export interface Price {
    name: string;
    amount: number;
} 

export interface Building {
    name: string;
    label: string;
    description: string;
    unlockRatio: number;
    prices: Price[],
    priceRatio: number;
    effects: any;
    amount?: number;
    unlocked?: boolean;
    unlocks?: Record<string, string[]>;
}

export class BuildingsManager extends Manager<Building> {
    readonly buildingsData: Building[] = [
        {
            name: 'farm',
            label: $I('building.farm.label'),
            description: $I('building.farm.description'),
            unlockRatio: 0.3,
            prices: [
                { name: 'food', amount: 10 }
            ],
            priceRatio: 1.12,
            effects: {
                'foodPerTickBase': 0.125,
            },
        }, {
            name: 'hut',
            label: $I('building.hut.label'),
            description: $I('building.farm.description'),
            unlockRatio: 0.3,
            prices: [
                { name: 'wood', amount: 10 }
            ],
            priceRatio: 1.75,
            effects: {
                'maxVillagers': 1
            },
            unlocks: {
                tabs: ['civic']
            }
        }
    ]
    
    public constructor() {
        super();
        this.initMetaData();
    }

    public update(): void {
        let rerender = false;

        for(const bldName in this.meta.meta) {
            const bld  = this.meta.meta[bldName];
            if(bld.unlocked)
                continue;
            if(!this.isUnlockable(bld))
                continue;
            rerender = true;
            bld.unlocked = true;
        }

        if(rerender)
            game.render();
    }

    public buyBuilding(bldName: string, amount: number): void {
        const bld = this.buildings[bldName];
        if(!this.isBuyable(bld)) {
            return;
        }
        bld.prices.forEach((p: Price) => {
            game.res.resources[p.name].amount -= this.getTotalPrice(bld, p);
        })
        bld.amount++;
    }

    public getTotalPrice({ priceRatio, amount }: Building, price: Price): number {
        return fixFloatingPoint(price.amount * Math.pow(priceRatio, amount));
    }

    protected initMetaData(): void {
        for(let i = 0; i < this.buildingsData.length; i++) {
            const bld = this.buildingsData[i];
            bld.amount = 0;
            bld.unlocked = false;

            this.meta.meta[bld.name] = bld;
        }
    }

    public getEffect(data: Building, effectName: string): number {
        return data.effects[effectName] * data.amount;
    }

    public save(): SaveDataInfo[] {
        const data: SaveDataInfo[] = [];
        for (const resName in this.meta.meta) {
            const res = this.meta.meta[resName];
            data.push({
                name: res.name,
                amount: res.amount,
                unlocked: res.unlocked,
            })
        }
        return data;
    }

    public load(buildings: SaveDataInfo[]): void {
        for(let i = 0; i < buildings.length; i++) {
            const bld = buildings[i];
            this.meta.meta[bld.name].amount = bld.amount;
            this.meta.meta[bld.name].unlocked = bld.unlocked;
        }
        
    }

    private isUnlockable({ prices, unlockRatio }: Building) {
        return prices.every(
            p => game.res.resources[p.name].amount >= (p.amount * unlockRatio)
        )
    }
    
    private isBuyable(bld: Building) {
        return bld.prices.every(
            p => game.res.resources[p.name].amount >= this.getTotalPrice(bld, p)
        )
    }
    
    public get buildings(): Record<string, Building> { return this.meta.meta; }
}