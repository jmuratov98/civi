import React from 'react'

interface ModalProps {
    children?: JSX.Element | JSX.Element[];
    noFooter?: boolean;
}
export default function({
    children,
    noFooter
}: ModalProps): JSX.Element {
    let className = 'modal';
    if(noFooter) className += ' no-footer';
    
    return (
        <div className={className}>
            {children}
        </div>
    )
}