import ReactDOM from "react-dom";
import React from 'react';

import { game } from '../game'
import { LeftColumn } from './tsx/left-column/left-column'
import { MiddleColumn } from './tsx/middle-column/middle-column'
import { RightColumn } from './tsx/right-column/right-column'
import { OptionsModal } from "./tsx/modal/options-modal";
import { HotkeysModal } from "./tsx/modal/hotkeys-modal";

export abstract class UISystem {
    protected themes: string[]
    protected activeTheme: string;
    protected defaultTheme: string;
    protected _activeTab: string;

    constructor() {}
    
    abstract render(): void;
    abstract update(): void;

    public abstract set activeTab(activeTab: string);
    public abstract get activeTab(): string;
}

export class DesktopUI extends UISystem {
    constructor() {
        super();

        this._activeTab = 'civilization';

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

        // Modals
        this.renderModal();
    }

    public renderModal(): void {
        ReactDOM.render(
            React.createElement(OptionsModal),
            document.getElementById('options-modal')
        )

        ReactDOM.render(
            React.createElement(HotkeysModal),
            document.getElementById('hotkeys-modal')
        )
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
            React.createElement(MiddleColumn, { activeTab: this._activeTab }),
            document.getElementById('middle-column')
        );
    }

    private renderRightColumn(): void {
        ReactDOM.render(
            React.createElement(RightColumn),
            document.getElementById('right-column')
        );
    }

    public set activeTab(activeTab: string) {
        if(activeTab === this._activeTab) return;

        this._activeTab = activeTab;
        this.renderMiddleColumn();
    }

    public get activeTab(): string { return this._activeTab; }

}