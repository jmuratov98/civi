import { Game } from "./game";
import { BuildingType, Price } from "./managers/buildings";
import { LeftColumn } from './tsx/left-column'
import { getPosition, incrementCssVariable, setCssVariable } from "./utils";
import React from 'react'
import ReactDOM from 'react-dom'

export class DesktopUI {
    private _gameContainerID: string
    private _game: Game;

    private _activeTabId = 'Forest';

    constructor(gameContainerID: string) {
        this._gameContainerID = gameContainerID;
    }

    public update(): void {
        this.updateTabs();
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
        this._dom.onclick = () => this._controller.onclick();
        container.appendChild(this._dom);

        this.renderTooltip();
    }

    private renderTooltip(): void {
        this._tooltip = document.getElementById('tooltip')
        
        const createTooltip = () => {
            this._tooltip.innerText = '';
        
            // TODO: Add stuff here later
            const tooltipHeader = document.createElement('header');
            tooltipHeader.classList.add("tooltip__header");
            this._tooltip.appendChild(tooltipHeader);

            const tooltipBody = document.createElement('header');
            tooltipBody.classList.add("tooltip__body");
            this._tooltip.appendChild(tooltipBody);
            
            const tooltipDescription = document.createElement('p');
            tooltipDescription.innerText = this._description;
            tooltipBody.appendChild(tooltipDescription)

            if(this._model) {
                tooltipBody.appendChild(document.createElement('hr'))

                const pricesLabel = document.createElement('p');
                pricesLabel.classList.add("tooltip__label")
                pricesLabel.innerText = 'prices';
                tooltipBody.appendChild(pricesLabel);

                const pricesSection = document.createElement('div');
                pricesSection.classList.add('tooltip__prices');
                tooltipBody.appendChild(pricesSection);
                
                // Prices
                const prices = this._model.prices;
                for(let i = 0; i < prices.length; i++) {
                    const price = prices[i];

                    const priceDiv = document.createElement('div');
                    priceDiv.classList.add('tooltip__price');
                    pricesSection.appendChild(priceDiv);

                    const priceNameSpan = document.createElement('span');
                    priceNameSpan.innerText = this._game.res.resources[price.name].label;
                    priceDiv.appendChild(priceNameSpan);
                    
                    const priceAmountSpan = document.createElement('span');
                    priceAmountSpan.innerText = price.amount.toString();
                    priceDiv.appendChild(priceAmountSpan);
                }

                tooltipBody.appendChild(document.createElement('hr'))
                
                // Effects
                const effectsLabel = document.createElement('p');
                effectsLabel.classList.add("tooltip__label")
                effectsLabel.innerText = 'effects';
                tooltipBody.appendChild(effectsLabel);

                const p = document.createElement('p')
                p.innerText = 'To be implemented soon'
                tooltipBody.appendChild(p)

                // const effects = this._model.effects;
                // for(let i in effects) {
                //     const effect = effects[i];

                // }
            }

            // TODO: Add stuff here later
            const tooltipFooter = document.createElement('footer');
            tooltipFooter.classList.add("tooltip__footer");
            this._tooltip.appendChild(tooltipFooter);
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
        // this._dom.onmouseout = () => this._tooltip.style.display = "none"
    }

    public update(): void {
        // TODO: Add stuff here later
    }
}

export class ButtonController {
    
    protected _game: Game;
    
    constructor(game: Game) { 
        this._game = game;
    }

    onclick(): void {}

}

export class FoodButtonController extends ButtonController {
    constructor(game: Game) { 
        super(game);
    }

    onclick(): void {
        this._game.res.increment('food', 1);
        this._game.render();
    }
}

export class WoodButtonController extends ButtonController {
    constructor(game: Game) { 
        super(game);
    }

    onclick(): void {
        this._game.res.increment('wood', 1);
        this._game.render();
    }
}

export class StoneButtonController extends ButtonController {
    constructor(game: Game) { 
        super(game);
    }

    onclick(): void {
        this._game.res.increment('stone', 1);
        this._game.render();
    }

}