import React from 'react';

import { TabsContainer } from './tabs-container';

export function GameContainer(): JSX.Element {
    return (
        <div id='game-container'>
            <TabsContainer />
        </div>
    )
}

export function MiddleColumn(): JSX.Element {
    return (
        <GameContainer />
    );
}