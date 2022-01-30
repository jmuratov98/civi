import './sass/style.scss';

import { game } from './civi/game'
import { DesktopUI } from './civi/ui/ui'

window.onload = function () {
    game.ui = new DesktopUI();
    
    game.render();
    game.start();
    
    (window as any).game = game;
}