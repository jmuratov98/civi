import React, { useState } from 'react'

import Modal from './modal/modal';
import ModalHeader from './modal/modal-header';
import ModalBody from './modal/modal-body';
import ModalFooter from './modal/modal-footer';
import { i18n } from '../../../i18n';

export function OptionsModal(): JSX.Element {

    function handleClose(): void {
        document.getElementById('options-modal').classList.toggle('is-active');
    }

    function setLanguage(language: string) {
        i18n.setLanguage(language);
    }

    return (
        <Modal>
            <ModalHeader
                title='Option Menu'
                hasHistory={false}
                handleClose={handleClose}
            />
            <ModalBody>
                <select name="select-langauge" id="select-langauge">
                    <option value="none">Languages</option>
                    {i18n.langs.map(lang => (
                        <option value="lang" onClick={() => setLanguage(lang)}>{i18n.langLabels[lang]}</option>
                    ))}
                </select>
            </ModalBody>
            <ModalFooter
                handleClose={handleClose}
            />
        </Modal>
    )
}