import React from 'react';

import { TabsContainer } from './tabs-container';

interface GameContainerProps {
    activeTab: string;
}
export function GameContainer({
    activeTab
}: GameContainerProps): JSX.Element {
    return (
        <div id='game-container'>
            <TabsContainer activeTab={activeTab} />
        </div>
    )
}

interface MiddleColumnProps {
    activeTab: string;
}
export function MiddleColumn({
    activeTab
}: MiddleColumnProps): JSX.Element {
    return (
        <GameContainer activeTab={activeTab} />
    );
}