import './sass/style.scss';
import { Game } from './civi/game';
import { DesktopUI } from './civi/ui'

window.onload = function () {
    const ui = new DesktopUI('game-container');
    (window as any).game = new Game(ui);
    (window as any).game.start();
    (window as any).game.render(0);
}