import { game } from '../game'

export abstract class ButtonController {
    abstract handleClick(model: string | void): void;
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

    public handleClick(bldName: string): void {
        game.bld.buyBuilding(bldName, 1)
        game.render();
    }
}