import React from 'react'

import Modal from '../components/modal/modal';
import Header from '../components/modal/modal-header';
import Body from '../components/modal/modal-body';
import { game, KeyBind } from '../../../game';

export function HotkeysModal(): JSX.Element {
    function handleClose(): void {
        document.getElementById('hotkeys-modal').classList.toggle('is-active');
    }

    function typeToLabel(type: string): string {
        return type;
    }

    function reduceKeybinds(): Record<string, KeyBind[]> {
        const result: Record<string, KeyBind[]> = {};
        for (let i = 0; i < game.options.keybinds.length; i++) {
            const kb = game.options.keybinds[i];

            if (!result[kb.type])
                result[kb.type] = [];

            result[kb.type].push(kb);
        }

        console.log(result);
        return result;
    }

    function KBDSection({ type, kbds }: { type: string, kbds: KeyBind[] }): JSX.Element {
        return (
            <section className="kbd-section">
                <span className='kbd-section-label'>{typeToLabel(type)}</span>
                {kbds.map((kbd, i) => (
                    <div key={i} className="kbd-keybind">
                        <div className="kbd-combo">
                            {kbd.ctrl && <kbd>Ctrl</kbd>}
                            {kbd.alt && <kbd>Alt</kbd>}
                            {kbd.meta && <kbd>Meta</kbd>}
                            {kbd.shift && <kbd>Shift</kbd>}
                            {kbd.key && <kbd>{
                                kbd.key == '/' ? '?' : 
                                kbd.key == 'ArrowLeft' ? <span>&#8592;</span>  :
                                kbd.key == 'ArrowRight' ? <span>&#8594;</span> :
                                kbd.key.toUpperCase()}</kbd>}
                        </div>
                        <div className="kbd-description">
                            {kbd.description}
                        </div>
                    </div>
                ))}
            </section>
        )
    }

    return (
        <Modal noFooter={true}>
            <Header
                title={'Hotkeys Menu'}
                handleClose={handleClose}
                hasHistory={false}
            />
            <Body>
                <div className="kbd-help">
                    {
                        Object.entries(reduceKeybinds()).map(([type, kbds], i) => (
                            <KBDSection
                                key={i}
                                type={type}
                                kbds={kbds}
                            />
                        ))
                    }
                </div>
            </Body>
        </Modal>
    )
}