import React, { useRef } from 'react';
import ReactDOM from 'react-dom';

import { Building } from '../../../managers/buildings'
import { ButtonController } from '../../../btn-controllers/btn-controller'
import { CivilizationTooltip } from '../tooltip/civilization-tooltip';
import {
    getPosition, setCssVariable
} from '../../../utils';

export interface ButtonProps {
    controller: ButtonController;
    label: string;
    description: string;
    model?: Building;
}
export function Button({
    controller,
    label,
    model,
    description
}: ButtonProps): JSX.Element {

    const buttonRef = useRef();

    const tooltipContainer = document.getElementById('tooltip-container');

    function createTooltip(): any {
        return ReactDOM.render(
            React.createElement(CivilizationTooltip, { model, description }),
            tooltipContainer
        )
    }

    function onMouseOver() {
        const attachTooltip = () => createTooltip();

        attachTooltip();

        const tooltip = (tooltipContainer.children[0] as HTMLElement);
        const pos = getPosition(buttonRef.current)
        pos.x += 310;

        const maxTooltipTop = window.scrollY + window.innerHeight - tooltip.clientHeight - 50;
        const maxTooltipLeft = window.scrollX + window.innerWidth - tooltip.clientWidth - 50;

        if (pos.left < maxTooltipLeft) {
            pos.y = Math.min(pos.top, maxTooltipTop);
        } else {
            pos.x = maxTooltipLeft;
            const vOffset = 35;
            if (pos.top + vOffset <= maxTooltipTop) {
                pos.y += vOffset
            } else {
                pos.y -= tooltip.clientHeight + 10;
            }
        }

        setCssVariable(tooltip, '--left', pos.x.toString());
        setCssVariable(tooltip, '--top', pos.y.toString());

        tooltipContainer.style.display = 'block';
    }

    function onMouseOut() {
        tooltipContainer.style.display = 'none';
    }

    function onClick(): void {
        if (model) {
            controller.handleClick(model.name)
        } else {
            controller.handleClick();
        }
    }

    return (
        <button
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
            onClick={onClick}
            ref={buttonRef}
            className="button"
        >
            {label}
            {model && (
                <span>({model.amount})</span>
            )}
        </button>
    )
}