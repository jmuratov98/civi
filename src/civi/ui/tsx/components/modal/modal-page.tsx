import React from 'react'

interface ModalPageProps {
    className?: string;
    id?: string;
    children?: JSX.Element | JSX.Element[];
}
export default function({
    className,
    id,
    children,
}: ModalPageProps): JSX.Element {
    return (
        <section className={`modal-page ${className}`} id={id}>
            {children}
        </section>
    )
}