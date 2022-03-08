import { game } from '../game'
import { Building } from '../managers/buildings';

export abstract class ButtonController {
    abstract handleClick(model: Building | void): void;
}

export class FoodButtonController extends ButtonController {
    public constructor() {
        super();
    }

    public handleClick(): void {
        game.res.increment('food', 1);
        game.render();
    }
}

export class WoodButtonController extends ButtonController {
    public constructor() {
        super();
    }

    public handleClick(): void {
        game.res.increment('wood', 1);
        game.render();
    }
}

export class StoneButtonController extends ButtonController {
    public constructor() {
        super();
    }

    public handleClick(): void {
        game.res.increment('stone', 1);
        game.render();
    }
}

export class BuildingButtonController extends ButtonController {
    public constructor() {
        super();
    }

    public handleClick(bld: Building): void {
        game.bld.buyBuilding(bld.name, 1);

        // Unlocks
        if(bld.unlocks) {
            game.unlocks(bld.unlocks)
        }

        game.render();
    }
}