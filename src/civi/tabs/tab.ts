import React from 'react';

import { Button } from '../ui/tsx/middle-column/button'
import { FoodButtonController, WoodButtonController, StoneButtonController } from '../btn-controllers/btn-controller';

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
}

export class CivilizationTab extends Tab {
    public constructor() {
        super('Civilization', 'civilization');
        this.visible = true;
        this.addCoreButtons()
    }

    public update(): void {
        this.buttons = [];

        this.addCoreButtons()
    }

    private addCoreButtons() : void {
        const foodBtn = React.createElement(Button, { 
            key: this.buttons.length,
            controller: new FoodButtonController(),
            label: 'Gather Food'
        })
        this.buttons.push(foodBtn);

        const woodBtn = React.createElement(Button, { 
            key: this.buttons.length,
            controller: new WoodButtonController(),
            label: 'Gather Wood'
        })
        this.buttons.push(woodBtn);

        const stoneBtn = React.createElement(Button, { 
            key: this.buttons.length,
            controller: new StoneButtonController(),
            label: 'Gather Stone'
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