// server/GameServer.js
const { v4: uuidv4 } = require('uuid');
const { 
    TICK_RATE,
    MAX_PLAYERS,
    MAP_SIZE,
    MIN_FRAGMENTS
} = require('./constants');

class GameServer {
    constructor(wss) {
        this.wss = wss;
        this.games = new Map();
        this.clients = new Map();
        
        this.setupWebSocket();
        this.startGameLoop();
    }

    setupWebSocket() {
        this.wss.on('connection', (ws) => {
            const clientId = uuidv4();
            
            // Initialize client state
            const clientState = {
                id: clientId,
                position: this.getRandomPosition(),
                modules: [],
                health: 100,
                score: 0
            };
            
            this.clients.set(clientId, {
                ws,
                state: clientState
            });

            // Send initial state to client
            this.sendToClient(ws, {
                type: 'init',
                data: {
                    id: clientId,
                    state: clientState,
                    mapSize: MAP_SIZE
                }
            });

            // Handle messages from client
            ws.on('message', (message) => {
                this.handleMessage(clientId, JSON.parse(message));
            });

            // Handle client disconnect
            ws.on('close', () => {
                this.handleDisconnect(clientId);
            });
        });
    }

    handleMessage(clientId, message) {
        const client = this.clients.get(clientId);
        if (!client) return;

        switch (message.type) {
            case 'move':
                this.handleMove(clientId, message.data);
                break;
            case 'attack':
                this.handleAttack(clientId, message.data);
                break;
            case 'collect':
                this.handleCollect(clientId, message.data);
                break;
            case 'build':
                this.handleBuild(clientId, message.data);
                break;
        }
    }

    handleMove(clientId, position) {
        const client = this.clients.get(clientId);
        if (!client) return;

        // Validate movement
        if (this.isValidMove(client.state, position)) {
            client.state.position = position;
            this.broadcastGameState();
        }
    }

    handleAttack(clientId, targetId) {
        const attacker = this.clients.get(clientId);
        const target = this.clients.get(targetId);
        
        if (!attacker || !target) return;

        const damage = this.calculateDamage(attacker.state, target.state);
        target.state.health -= damage;

        if (target.state.health <= 0) {
            this.handlePlayerDeath(targetId, clientId);
        }

        this.broadcastGameState();
    }

    handleCollect(clientId, fragmentId) {
        // Fragment collection logic
    }

    handleBuild(clientId, buildData) {
        // Module building logic
    }

    handlePlayerDeath(deadPlayerId, killerId) {
        const deadPlayer = this.clients.get(deadPlayerId);
        const killer = this.clients.get(killerId);

        if (!deadPlayer || !killer) return;

        // Transfer resources and update scores
        killer.state.score += 100;
        this.respawnPlayer(deadPlayer);

        this.broadcastGameState();
    }

    respawnPlayer(player) {
        player.state = {
            ...player.state,
            position: this.getRandomPosition(),
            health: 100,
            modules: []
        };
    }

    handleDisconnect(clientId) {
        this.clients.delete(clientId);
        this.broadcastGameState();
    }

    startGameLoop() {
        setInterval(() => {
            this.update();
            this.broadcastGameState();
        }, 1000 / TICK_RATE);
    }

    update() {
        // Update game state, hazards, etc.
    }

    broadcastGameState() {
        const gameState = {
            players: Array.from(this.clients.values()).map(c => c.state),
            fragments: Array.from(this.getFragments()),
            hazards: this.getHazards()
        };

        this.clients.forEach(client => {
            this.sendToClient(client.ws, {
                type: 'gameState',
                data: gameState
            });
        });
    }

    sendToClient(ws, data) {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(data));
        }
    }

    getRandomPosition() {
        return {
            x: Math.random() * MAP_SIZE,
            y: Math.random() * MAP_SIZE
        };
    }

    isValidMove(playerState, newPosition) {
        // Add movement validation logic
        return true;
    }

    calculateDamage(attacker, target) {
        // Add damage calculation logic
        return 10;
    }

    getFragments() {
        // Return current fragments on map
        return [];
    }

    getHazards() {
        // Return current hazards on map
        return [];
    }
}

module.exports = GameServer;
