import { game } from './game';

export class Villager {

    readonly firstName: string;
    readonly lastName: string;
    readonly middleName: string;

    private age: number;
    private level: number;
    private exp: number;

    private isLeader: boolean;

    // TODO: Add trait, job and others

    public constructor() {
        this.firstName = 'First'
        this.lastName = 'Name'
        this.middleName = ''

        this.age = 0;
        this.level = 0;
        this.exp = 0;

        this.isLeader = false;
    }

}

const VILLAGER_PROGRESS_RATE = 1;

export class VillagerSimulator {
    readonly villagers: Villager[];
    private maxVillagers: number;

    private nextVillagerProgress: number;


    public constructor() {
        this.villagers = [];

        this.maxVillagers = 0;
        this.nextVillagerProgress = 0;
    }

    public update(): void {
        if(this.villagers.length < this.maxVillagers) {
            if(this.nextVillagerProgress == 100) {
                this.villagers.push(new Villager());
                this.nextVillagerProgress = 0;
            } else {
                this.nextVillagerProgress += VILLAGER_PROGRESS_RATE;
            }
        }

        this.maxVillagers = game.getEffect('villagerMax');
    }

    get progress(): number { return this.nextVillagerProgress; }
}