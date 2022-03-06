import React from 'react'

interface ModalFooterProps {
    handleClose: () => void;
}
export default function ({
    handleClose
}: ModalFooterProps): JSX.Element {
    return (
        <footer className="modal__footer">
            <button className="button" id="apply-changes">Apply Changes</button>
            <button className="button cancel" onClick={handleClose}>Cancel</button>
        </footer>
    )
}