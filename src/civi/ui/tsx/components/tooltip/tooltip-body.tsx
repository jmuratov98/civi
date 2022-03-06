import React from 'react';

interface TooltipBodyProps {
    children?: JSX.Element | JSX.Element[];
}
export function TooltipBody({
    children
}: TooltipBodyProps): JSX.Element {
    return (
        <div className="tooltip__body">
            {children}
        </div>
    )
}