import React from 'react';

interface TooltopProps {
    children: JSX.Element | JSX.Element[]
}
export function Tooltip({
    children
}: TooltopProps): JSX.Element {
    return (
        <div id="tooltip" className="tooltip">
            {children}
        </div>
    )
}