import './sass/style.scss';
import { Game } from './civi/game';
import { DesktopUI } from './civi/ui'

window.onload = function () {
    const ui = new DesktopUI('game-container');
    (window as any).game = new Game(ui);

    (window as any).game.load();
    (window as any).game.render(0);
    (window as any).game.start();

    document.getElementById('save-btn').onclick = function() {
        console.log('saving...'); // TODO: This should be logged out in the game console, not window.console.
        (window as any).game.save();
    }

    document.getElementById('wipe-btn').onclick = function() {
        console.log('wiping...'); // TODO: This should be logged out in the game console, not window.console.
        (window as any).game.wipe();
    }
}