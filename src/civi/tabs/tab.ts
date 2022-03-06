import React from 'react';

import { game } from '../game';
import { Button, ButtonProps } from '../ui/tsx/middle-column/button';
import {
    FoodButtonController,
    WoodButtonController,
    StoneButtonController,
    BuildingButtonController
} from '../btn-controllers/btn-controller';
import { $I } from '../i18n';

export abstract class Tab {
    public buttons: any[];
    readonly name: string;
    readonly id: string;
    public visible: boolean;

    protected constructor(name: string, id: string) {
        this.visible = false;
        this.name = name;
        this.id = id;
        this.buttons = [];
    }

    abstract update(): void;

    protected createButton(props: ButtonProps): React.FunctionComponentElement<ButtonProps> {
        return React.createElement(Button, {
            key: this.buttons.length,
            ...props
        })
    }
}

export class CivilizationTab extends Tab {
    public constructor() {
        super($I('tab.civilization.label'), 'civilization');
        this.visible = true;
        this.addCoreButtons()
    }

    public update(): void {
        this.buttons = [];

        this.addCoreButtons();

        for(const bldName in game.bld.buildings) {
            const bld = game.bld.buildings[bldName];

            if(!bld.unlocked)
                continue;

            const button = this.createButton({
                controller: new BuildingButtonController(),
                label: bld.label,
                model: bld,
                description: bld.description,
            });
            this.buttons.push(button);
        }
    }

    private addCoreButtons() : void {
        const foodBtn = this.createButton({ 
            controller: new FoodButtonController(),
            label: $I('resource.food.button'),
            description: $I('resource.food.description'),
        })
        this.buttons.push(foodBtn);

        const woodBtn = this.createButton({ 
            controller: new WoodButtonController(),
            label: $I('resource.wood.button'),
            description: $I('resource.wood.description'),
        })
        this.buttons.push(woodBtn);

        const stoneBtn = this.createButton({ 
            controller: new StoneButtonController(),
            label: $I('resource.stone.button'),
            description: $I('resource.stone.description'),

        })
        this.buttons.push(stoneBtn);
    }
}

export class CivicTab extends Tab {
    public constructor() {
        super($I('tab.civic.label'), 'civic');
        this.visible = true;
    }

    public update(): void {
    }
}

export class TestTab extends Tab {
    public constructor() {
        super('Test', 'test');
        this.visible = true;
    }

    public update(): void {
    }
}