import React from 'react';

interface TooltipHeaderProps {
    children?: JSX.Element | JSX.Element[];
}
export function TooltipHeader({
    children
}: TooltipHeaderProps): JSX.Element {
    return (
        <header className="tooltip__header">
            {children}
        </header>
    )
}
