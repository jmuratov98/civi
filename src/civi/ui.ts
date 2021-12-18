import { Game } from "./game";
import { BuildingType } from "./managers/buildings";
import { LeftColumn } from './tsx/left-column'
import { Tooltip } from './tsx/tooltip'
import { getPosition, setCssVariable } from "./utils";
import React from 'react'
import ReactDOM from 'react-dom'

export class DesktopUI {
    private _gameContainerID: string
    private _game: Game;

    private _activeTabId = 'Civilization';

    constructor(gameContainerID: string) {
        this._gameContainerID = gameContainerID;
    }

    public update(): void {
        this.updateTabs();
        
        // This is to force re-render the left component
        this.renderLeftColumn()
    }

    private updateTabs(): void {
        for(let i = 0; i < this._game.tabs.length; i++) {
            const tab = this._game.tabs[i];
            if(tab.id == this._activeTabId)
                tab.update();
        }
    }

    public render(): void {
        const gameContainer = document.getElementById(this._gameContainerID);
        gameContainer.innerHTML = ''

        this.renderTabs(gameContainer);
        this.renderActiveTab(gameContainer);
        this.renderLeftColumn();
        this.renderConsole();
    }

    private renderTabs(container: HTMLElement): void {
        const visibleTabs = this.game.tabs.filter((tab) => tab.visible);

        const tabsContainer = document.createElement("div");
        tabsContainer.classList.add("tabs")
        for (let i = 0; i < visibleTabs.length; i++) {
            const tab = visibleTabs[i];

            const tabLink = document.createElement("span");
            tabLink.innerHTML = tab.label
            tabLink.className = `tab ${tab.id}`
            tabLink.onclick = () => {
                if(this._activeTabId === tab.id) return;

                this._activeTabId = tab.id;
                this.render();
            }
            tabsContainer.appendChild(tabLink);

            if (i < visibleTabs.length - 1) {
                const divider = document.createElement("span");
                divider.innerText = '|'
                tabsContainer.appendChild(divider);
            }
        }

        container.appendChild(tabsContainer);
    }

    private renderActiveTab(container: HTMLElement): void {
        const visibleTabs = this.game.tabs.filter(tab => tab.visible)

        for (let i = 0; i < visibleTabs.length; i++) {
            const tab = visibleTabs[i];
            if(tab.id != this._activeTabId)
                continue;

            const tabInnerContainer = document.createElement("fieldset");
            tabInnerContainer.classList.add("tab-content")
            const legend = document.createElement("legend")
            legend.innerText = tab.label

            tab.render(tabInnerContainer);

            tabInnerContainer.appendChild(legend);
            container.appendChild(tabInnerContainer);

            break;
        }
    }

    private renderLeftColumn(): void {

        ReactDOM.render(
            React.createElement(LeftColumn, { game: this.game }),
            document.getElementById('left-column'),
        )

    }

    private renderConsole(): void { 
        const container = document.getElementById('console-container');
        container.innerHTML = ''

        const consoleHeader = document.createElement('header');
        consoleHeader.className = 'console__header';
        container.appendChild(consoleHeader);

        const clearLog = document.createElement('span')
        clearLog.innerHTML = 'Clear Log';
        clearLog.className = 'console__clear'
        clearLog.onclick = () => this._game.console.clear();
        consoleHeader.appendChild(clearLog);

        const consoleBody = document.createElement('div');
        consoleBody.className = 'console__body';
        container.appendChild(consoleBody);

        this._game.console.messages.forEach((msg) => {
            this._game.console.renderMessage(consoleBody, msg);
        })
    }

    public get game(): Game { return this._game; }
    public set game(game: Game) { this._game = game; }
}

interface ButtonConstructorParams {
    label: string;
    description: string;
    controller: ButtonController;
    model?: BuildingType;
    game: Game;
}

export class Button {
    private _label: string;
    private _description: string;
    private _controller: ButtonController;
    private _dom: HTMLDivElement; 
    private _tooltip: HTMLElement;
    private _model?: BuildingType;
    private _game: Game;

    public constructor({ label, description, controller, model, game }: ButtonConstructorParams) {
        this._label = label;
        this._description = description;
        this._controller = controller;
        this._model = model;
        this._game = game;
    }

    public render(container: HTMLElement): void {
        this._dom = document.createElement("div");
        this._dom.classList.add("button");
        this._dom.innerText = this._label;
        if(this._model) {
            this._dom.innerText += ` (${this._model.amount})`;
        }
        this._dom.onclick = () => this.onclick();
        container.appendChild(this._dom);

        this.renderTooltip();
    }

    private onclick(): void {
        this._controller.handleClick(this._model)
    }

    private renderTooltip(): void {
        this._tooltip = document.getElementById('tooltip')
        
        const createTooltip = () => {
            return ReactDOM.render(
                React.createElement(Tooltip, { game: this._game, button: this }),
                this._tooltip
            )
        }        

        this._dom.onmouseover = () => {
            const attachTooltip = () => {
                createTooltip();
            }
            attachTooltip();

            const pos = getPosition(this._dom)
            pos.x += 310;

            const maxTooltipTop = window.scrollY + window.innerHeight - this._tooltip.clientHeight - 50;
            const maxTooltipLeft = window.scrollX + window.innerWidth - this._tooltip.clientWidth - 50;

            if(pos.left < maxTooltipLeft) {
                pos.y = Math.min(pos.top + 15, maxTooltipTop);
            } else {
                pos.x = maxTooltipLeft;
                const vOffset = 35;
                if(pos.top + vOffset <= maxTooltipTop) {
                    pos.y += vOffset
                } else {
                    pos.y -= this._tooltip.clientHeight + 10;
                }
            }

            setCssVariable(this._tooltip, '--left', pos.x.toString());
            setCssVariable(this._tooltip, '--top', pos.y.toString());

            this._tooltip.style.display = '';
        };
        this._dom.onmouseout = () => this._tooltip.style.display = "none"
    }

    public update(): void {
        // TODO: Add stuff here later
    }

    get description(): string { return this._description; }
    get model(): BuildingType { return this._model; }
}

export interface ButtonController {
    handleClick(model: BuildingType | null): void;
}

export class BuildingButtonController implements ButtonController {
    private _game: Game;

    constructor(game: Game) { 
        this._game = game;
    }

    handleClick(model: BuildingType | null): void {
        this._game.bld.buyBuilding(model?.name);

        if(model.unlocks) {
            this._game.unlock(model.unlocks);
        }

        if(model.name == 'hut') {
            // Adds a timer from when the user buys a hut, until the villager arrives to the village
            window.setTimeout(() => {
                this._game.console.pushMessage('A villager has joined your civilization')
                this._game.res.increment('villagers', 1);
            }, 10000)
        }

        this._game.render();
    }
}

export class FoodButtonController implements ButtonController {
    private _game: Game;

    constructor(game: Game) { 
        this._game = game;
    }

    handleClick(): void {
        this._game.res.increment('food', 1);
        this._game.render();
    }
}

export class WoodButtonController implements ButtonController {
    private _game: Game;

    constructor(game: Game) { 
        this._game = game;
    }

    handleClick(): void {
        this._game.res.increment('wood', 1);
        this._game.render();
    }
}

export class StoneButtonController implements ButtonController {
    private _game: Game;
    
    constructor(game: Game) { 
        this._game = game;
    }

    handleClick(): void {
        this._game.res.increment('stone', 1);

        // Mining stone will randomly give you some ore to smelt
        const rand = Math.random()
        if(rand < this._game.getEffect('orePercentageBase'))
            this._game.res.increment('ore', 1)

        this._game.render();
    }

}