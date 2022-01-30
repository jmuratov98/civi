import React from 'react';

import { game } from '../../../game';

interface MessageProps {
    message: string
}
export function Message({
    message
}: MessageProps): JSX.Element {
    return (
        <li>{message}</li>
    )
}

export function Console(): JSX.Element {
    return (
        <ul>
            {game.console.messages.map((msg: string, index: number) => (
                <Message
                    key={index}
                    message={msg}
                />
            ))}
        </ul>
    );
}

export function RightColumn(): JSX.Element {
    return (
        <Console />
    )
}