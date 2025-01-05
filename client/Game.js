// client/src/Game.js
import Phaser from 'phaser';
import BootScene from './scenes/BootScene';
import GameScene from './scenes/GameScene';

export default class Game extends Phaser.Game {
    constructor() {
        const config = {
            type: Phaser.AUTO,
            width: window.innerWidth,
            height: window.innerHeight,
            physics: {
                default: 'arcade',
                arcade: {
                    debug: false,
                    gravity: { y: 0 }
                }
            },
            scene: [BootScene, GameScene],
            parent: 'game'
        };

        super(config);

        window.addEventListener('resize', () => {
            this.scale.resize(window.innerWidth, window.innerHeight);
        });
    }
}
