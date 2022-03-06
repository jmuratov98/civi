import React from 'react'

interface ModalBodyProps {
    children?: JSX.Element | JSX.Element[];
}
export default function({
    children
}: ModalBodyProps): JSX.Element {
    return (
        <div className="modal__body">
            {children}
        </div>
    )
}