import './sass/style.scss';

import { game, Game } from './civi/game'
import { i18n } from './civi/i18n'
import { DesktopUI } from './civi/ui/ui'

function initGame() {
    game.init();
    game.ui = new DesktopUI();
    
    game.load();
    game.render();
    game.start();

    // keyboard shortcuts
    document.onkeydown = function (e: KeyboardEvent) {
        for(let i = 0; i < game.options.keybinds.length; i++) {
            const kb = game.options.keybinds[i];
            if(
                e.ctrlKey == kb.ctrl &&
                e.altKey == kb.alt &&
                e.shiftKey == kb.shift &&
                e.key == kb.key
            ) {
                kb.action();
            }
        }
    }

    // Various Buttons
    document.getElementById('wipe-btn').onclick = function () {
        if(confirm('Are you sure you want to wipe your progress?'))
            game.wipe();
    }

    document.getElementById('save-btn').onclick = function () {
        game.save();
    }

    document.getElementById('options-btn').onclick = game.toggleOptions;
    document.getElementById('hotkeys-btn').onclick = game.toggleHotkeys;
}

declare global {
    interface Window {
        civi: Game;
    }
}

window.onload = function () {
    i18n
        .init()
        .then(() => initGame());

    // (window as GameWindow).game = game;
    window.civi = game;
}