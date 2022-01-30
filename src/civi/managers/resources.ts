export interface Resource {
    name: string;
    label: string;
    amount?: number;
    unlocked?: boolean;
}
export class ResourcesManager {

    readonly resources: Record<string, Resource> = {
        food: {
            name: 'food',
            label: 'Food',
        },
        wood: {
            name: 'wood',
            label: 'Wood',
        },
        stone: {
            name: 'stone',
            label: 'Stone',
        },
        villager: {
            name: 'villager',
            label: 'Villager',
        },
        ore: {
            name: 'ore',
            label: 'Ore'
        }
    }

    public constructor() {
        for(const resName in this.resources) {
            const res = this.resources[resName];

            res.amount = 0;
            res.unlocked = false;
            console.log(this.resources)
        }
    }

    public increment(name: string, amount: number): void {
        this.resources[name].amount += amount
    }

    public update(): void {
        for(const resName in this.resources) {
            const res = this.resources[resName];

            if(!res.unlocked && res.amount > 0) res.unlocked = true

            // Calculate the per tick here
        }
    }
}