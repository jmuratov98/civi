import './sass/style.scss';

import { game } from './civi/game'
import { i18n } from './civi/i18n'
import { DesktopUI } from './civi/ui/ui'

function initGame(err: any) {
    if(err) {
        console.error(err)
        return;
    }
    
    game.init();
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

window.onload = function () {
    i18n.init(initGame);
}