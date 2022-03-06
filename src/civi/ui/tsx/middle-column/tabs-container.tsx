import React, { useState, useEffect } from 'react';

import { game } from '../../../game'
import { Tab } from '../../../tabs/tab'

interface TabContentProps {
    buttons: any[]
}
export function TabContent({
    buttons
}: TabContentProps): JSX.Element {
    return (
        <div className="tab__content">
            {buttons}
        </div>
    )
}

interface TabsContainerProps {
    activeTab: string
}
export function TabsContainer({ 
    activeTab
}: TabsContainerProps): JSX.Element {

    return (
        <div id="tabs-container">
            <div className="tabs" role='tablist' aria-orientation='horizontal'>
                {game.tabs.filter(tab => tab.visible).map((tab: Tab) => (
                    <span
                        className={`tab${activeTab === tab.id ? ' is-active' : ''}`}
                        id={tab.id}
                        key={tab.id}
                        onClick={() => {
                            game.ui.activeTab = tab.id;
                        }}
                    >
                        {tab.name}
                    </span>
                ))}
            </div>
            <TabContent
                buttons={game.tabs.find((tab: Tab) => tab.id === activeTab).buttons}
            />
        </div>
    )
}
