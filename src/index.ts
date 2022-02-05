import './sass/style.scss';

import { game } from './civi/game'
import { DesktopUI } from './civi/ui/ui'

window.onload = function () {
    game.ui = new DesktopUI();
    
    game.load();
    game.render();
    game.start();

    document.getElementById('wipe-btn').onclick = function () {
        game.wipe();
    }

    document.getElementById('save-btn').onclick = function () {
        game.save();
    }
    
}