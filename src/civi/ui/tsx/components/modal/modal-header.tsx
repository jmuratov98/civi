import React from 'react';

interface ModalHeaderProps {
    title: string;
    hasHistory?: boolean;
    handleClose: () => void;
    handleBack?: () => void;
}
export default function({
    title,
    hasHistory,
    handleClose,
    handleBack
}: ModalHeaderProps): JSX.Element {
    return (
        <header className="modal__header">
            <p className="modal__header-title">{title}</p>
            {hasHistory ? 
                <button className="back" aria-label="back" onClick={handleBack}>{'Back'}</button> :
                <button className="delete" aria-label="close" onClick={handleClose}></button>
            }
        </header>
    )
}