import { game } from '../game';

interface Price {
    name: string;
    amount: number;
} 

interface Building {
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

export class BuildingsManager {
    readonly buildings: Record<string, Building> = {
        farm: {
            name: 'farm',
            label: 'Farm',
            description: 'Plant some wheat to feed your population.',
            unlockRatio: 0.3,
            prices: [
                { name: 'food', amount: 10 }
            ],
            priceRatio: 1.12,
            effects: {
                'foodPerTickBase': 0.125,
            },
        }
    }
    
    public constructor() {
        for(const bldName in this.buildings) {
            const bld = this.buildings[bldName];

            bld.amount = 0;
            bld.unlocked = false;
            bld.unlocks = {};
        }
    }

    public update(): void {
    }
}