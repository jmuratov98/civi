import React from 'react';

interface TooltipSectionProps {
    children?: JSX.Element | JSX.Element[];
    label: string
}
export function TooltipSection({
    children,
    label
}: TooltipSectionProps): JSX.Element {
    return (
        <section className="tooltip__section">
            <p className="tooltip__label">{label}</p>
            {children}
        </section>
    )
}