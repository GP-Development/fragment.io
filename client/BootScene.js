// client/src/scenes/BootScene.js
import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Load assets
        this.load.image('player', 'assets/player.png');
        this.load.image('fragment', 'assets/fragment.png');
        this.load.image('module', 'assets/module.png');
    }

    create() {
        this.scene.start('GameScene');
    }
}