import React, { useState } from 'react';

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

export function TabsContainer(): JSX.Element {
    const [activeTab, setActiveTab] = useState<string>('civilization')
    return (
        <div id="tabs-container">
            <div className="tabs" role='tablist' aria-orientation='horizontal'>
                {game.tabs.map((tab: Tab) => (
                    <span 
                        className={`tab${activeTab === tab.id ? ' is-active' : ''}`}
                        id={tab.id}
                        key={tab.id}
                        onClick={() => {
                            if (tab.id === activeTab) return;

                            setActiveTab(tab.id);
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
