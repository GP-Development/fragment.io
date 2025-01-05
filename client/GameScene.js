// client/src/scenes/GameScene.js
import Phaser from 'phaser';
import NetworkManager from '../managers/NetworkManager';
import Player from '../entities/Player';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.players = new Map();
        this.fragments = new Map();
    }

    create() {
        this.networkManager = new NetworkManager(this);
        this.setupInput();
    }

    setupInput() {
        this.cursors = this.input.keyboard.createCursorKeys();
        
        this.input.on('pointerdown', (pointer) => {
            // Handle shooting or building
        });
    }

    update() {
        if (this.playerEntity) {
            this.handlePlayerMovement();
        }
    }

    handlePlayerMovement() {
        const speed = 5;
        let velocity = { x: 0, y: 0 };

        if (this.cursors.left.isDown) velocity.x -= speed;
        if (this.cursors.right.isDown) velocity.x += speed;
        if (this.cursors.up.isDown) velocity.y -= speed;
        if (this.cursors.down.isDown) velocity.y += speed;

        if (velocity.x !== 0 || velocity.y !== 0) {
            this.networkManager.sendMove(velocity);
        }
    }

    addPlayer(playerData) {
        const player = new Player(this, playerData);
        this.players.set(playerData.id, player);
        
        if (playerData.id === this.networkManager.playerId) {
            this.playerEntity = player;
            this.cameras.main.startFollow(player.sprite);
        }
    }

    updateGameState(gameState) {
        // Update all game entities
        this.updatePlayers(gameState.players);
        this.updateFragments(gameState.fragments);
        this.updateHazards(gameState.hazards);
    }

    updatePlayers(players) {
        players.forEach(playerData => {
            let player = this.players.get(playerData.id);
            if (!player) {
                this.addPlayer(playerData);
            } else {
                player.update(playerData);
            }
        });
    }

    updateFragments(fragments) {
        // Update fragment entities
    }

    updateHazards(hazards) {
        // Update hazard entities
    }
}