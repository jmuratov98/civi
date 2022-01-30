import React from 'react';

import { ButtonController } from '../../../btn-controllers/btn-controller'

interface ButtonProps {
    controller: ButtonController;
    label: string;
}
export function Button({
    controller,
    label,
}: ButtonProps): JSX.Element {
    function onClick(): void {
        controller.handleClick();
    }

    return <button onClick={onClick} className="button">{label}</button>
}