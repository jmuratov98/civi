import React from 'react';

import { game } from '../game';
import { Button, ButtonProps } from '../ui/tsx/middle-column/button';
import {
    FoodButtonController,
    WoodButtonController,
    StoneButtonController,
    BuildingButtonController
} from '../btn-controllers/btn-controller';

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
        super('Civilization', 'civilization');
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
            label: 'Gather Food',
            description: 'Gather some food for the villagers to eat',
        })
        this.buttons.push(foodBtn);

        const woodBtn = this.createButton({ 
            controller: new WoodButtonController(),
            label: 'Chop Wood',
            description: 'Chop some wood to build',
        })
        this.buttons.push(woodBtn);

        const stoneBtn = this.createButton({ 
            controller: new StoneButtonController(),
            label: 'Mine Stone',
            description: 'Mine stone to build'
        })
        this.buttons.push(stoneBtn);
    }
}

export class CivicTab extends Tab {
    public constructor() {
        super('Civic', 'civic');
        this.visible = true;
    }

    public update(): void {
    }
}