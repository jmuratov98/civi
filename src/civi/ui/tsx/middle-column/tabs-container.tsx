import React, { useState, useEffect } from 'react';

import { game } from '../../../game'
import { Tab } from '../../../tabs/tab'


// TODO: Remove this from here
interface KeyBind {
    alt: boolean,
    ctrl: boolean,
    shift: boolean,
    key: string,
    name: string,
}
const keybinds: KeyBind[] = [
    {
        alt: true,
        ctrl: false,
        shift: false,
        key: '1',
        name: 'civilization'
    }, {
        alt: true,
        ctrl: false,
        shift: false,
        key: '2',
        name: 'civic'
    }
]


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
    const [activeTab, setActiveTab] = useState<string>('civilization');

    useEffect(() => {
        function keybindListener(e: KeyboardEvent) {
            for(let i = 0; i < keybinds.length; i++) {
                const kb = keybinds[i]
                if(
                    kb.alt == e.altKey &&
                    kb.ctrl == e.ctrlKey &&
                    kb.shift == e.shiftKey &&
                    kb.key == e.key
                ) {
                    setActiveTab(kb.name)
                }
            }
        }

        document.onkeydown = keybindListener;
        console.log(document.onkeydown)

        console.log(game.tabs);
        

        return document.removeEventListener('keydown', keybindListener);
    }, [])

    return (
        <div id="tabs-container">
            <div className="tabs" role='tablist' aria-orientation='horizontal'>
                {game.tabs.filter(tab => tab.visible).map((tab: Tab) => (
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
