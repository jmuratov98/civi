import React from 'react';

interface TooltipFooterProps {
    children?: JSX.Element | JSX.Element[];
}
export function TooltipFooter({
    children
}: TooltipFooterProps): JSX.Element {
    return (
        <header className="tooltip__header">
            {children}
        </header>
    )
}