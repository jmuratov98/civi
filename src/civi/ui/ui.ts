import ReactDOM from "react-dom";
import React from 'react';

import { game } from '../game'
import { LeftColumn } from './tsx/left-column/left-column'
import { MiddleColumn } from './tsx/middle-column/middle-column'
import { RightColumn } from './tsx/right-column/right-column'

export abstract class UISystem {
    protected themes: string[]
    protected activeTheme: string;
    protected defaultTheme: string;

    constructor() {}
    
    abstract render(): void;
    abstract update(): void;
}

export class DesktopUI extends UISystem {
    constructor() {
        super();

        // Future use
        this.themes = ['default'];
        this.defaultTheme = 'default';
        this.activeTheme = 'default';
    }

    render(): void {
        this.renderLeftColumn();
        this.renderMiddleColumn();
        this.renderRightColumn()

        // Topbar
        this.renderTopbar();
    }

    public update(): void {
        this.renderLeftColumn();
        this.renderMiddleColumn();
        this.renderRightColumn();    
    }

    private renderTopbar(): void {
        const {
            version: { major, minor, build, revision }
        } = game;

        const versionDom = document.querySelector('.navbar__version');
        versionDom.innerHTML = `v${major}.${minor}.${build}.${revision}`        
    }

    private renderLeftColumn(): void {
        ReactDOM.render(
            React.createElement(LeftColumn),
            document.getElementById('left-column')
        )
    }

    private renderMiddleColumn(): void {
        ReactDOM.render(
            React.createElement(MiddleColumn),
            document.getElementById('middle-column')
        );
    }

    private renderRightColumn(): void {
        ReactDOM.render(
            React.createElement(RightColumn),
            document.getElementById('right-column')
        );
    }

}