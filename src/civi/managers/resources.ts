import { game, SaveDataInfo } from '../game';
import { fixFloatingPoint } from '../utils';
import { Manager } from './managers';

export interface Resource {
    name: string;
    label: string;
    amount?: number;
    unlocked?: boolean;
}
export class ResourcesManager extends Manager<Resource> {

    readonly resourceData: Resource[] = [
        {
            name: 'food',
            label: 'Food',
        },
        {
            name: 'wood',
            label: 'Wood',
        },
        {
            name: 'stone',
            label: 'Stone',
        },
        {
            name: 'villager',
            label: 'Villager',
        }, {
            name: 'ore',
            label: 'Ore'
        }
    ]

    public constructor() {
        super();
        this.initMetaData();
    }

    public increment(name: string, amount: number): void {
        this.resources[name].amount += amount
    }

    public update(): void {
        for(const resName in this.resources) {
            const res = this.resources[resName];

            if(!res.unlocked && res.amount > 0) res.unlocked = true

            // Calculate the per tick here
            const perTick = game.getEffect(`${res.name}PerTickBase`);
            this.resources[resName].amount += fixFloatingPoint(perTick);  

            const resMax = game.getEffect(`${res.name}Max`);
            if(res.amount > resMax) {
                res.amount = resMax
            }
        }
    }

    protected initMetaData(): void {
        for(let i = 0; i < this.resourceData.length; i++) {
            const res = this.resourceData[i];
            res.amount = 0;
            res.unlocked = false;
            
            this.meta.meta[res.name] = res;
        }
    }

    public getEffect(data: Resource, effectName: string): number { return 0; }

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
    
    public load(resources: SaveDataInfo[]): void {
        for(let i = 0; i < resources.length; i++) {
            const res = resources[i];
            
            this.meta.meta[res.name].amount = res.amount;
            this.meta.meta[res.name].unlocked = res.unlocked;
        }
    }

    public get resources(): Record<string, Resource> { return this.meta.meta; }
}