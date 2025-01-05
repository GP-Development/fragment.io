// client/src/entities/Player.js
export default class Player {
    constructor(scene, data) {
        this.scene = scene;
        this.id = data.id;
        this.sprite = scene.add.sprite(data.position.x, data.position.y, 'player');
        this.modules = new Map();
        
        this.update(data);
    }

    update(data) {
        this.sprite.x = data.position.x;
        this.sprite.y = data.position.y;
        this.updateModules(data.modules);
    }

    updateModules(modules) {
        // Update attached modules
    }
}