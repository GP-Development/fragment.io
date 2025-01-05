// client/src/managers/NetworkManager.js
export default class NetworkManager {
    constructor(scene) {
        this.scene = scene;
        this.connect();
    }

    connect() {
        this.socket = new WebSocket(`ws://${window.location.hostname}:8080`);
        
        this.socket.onopen = () => {
            console.log('Connected to server');
        };

        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            this.handleMessage(message);
        };

        this.socket.onclose = () => {
            console.log('Disconnected from server');
            // Implement reconnection logic
        };
    }

    handleMessage(message) {
        switch (message.type) {
            case 'init':
                this.playerId = message.data.id;
                this.scene.addPlayer(message.data.state);
                break;
            case 'gameState':
                this.scene.updateGameState(message.data);
                break;
        }
    }

    sendMove(velocity) {
        this.send('move', velocity);
    }

    send(type, data) {
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ type, data }));
        }
    }
}