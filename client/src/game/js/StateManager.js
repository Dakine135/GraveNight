const Utilities = require('../shared/Utilities.js');
const EnergyNode = require('./Entities/EnergyNode');

module.exports = class StatesManager {
    constructor({ debug = false, debugState = false, engine = null }) {
        console.log('Create State Manager');
        this.debug = debug;
        this.debugState = debugState;
        this.ENGINE = engine;

        this.currentEntityId = 0;

        this.updatableEntities = {};
        this.drawableEntities = {};
        this.lightBlockingEntities = {};
        this.collisionEntities = {};
    } //constructor

    update(deltaTime) {
        Object.entries(this.updatableEntities).forEach(([id, entity]) => {
            entity.update();
        });
    }

    draw(deltaTime) {
        Object.entries(this.drawableEntities).forEach(([id, entity]) => {
            entity.draw(this.ENGINE.render, this.ENGINE.CAMERA);
        });
        // let drawingState = this.getIntermediateState(deltaTime);

        // if (drawingState == null) return;
    } //draw

    getIntermediateState(deltaTime) {} // getIntermediateState

    placeEnergyNode({ x = this.ENGINE.CONTROLS.mouseLocationInWorld.x, y = this.ENGINE.CONTROLS.mouseLocationInWorld.y } = {}) {
        console.log('placeEnergyNode');
        let newEnergyNode = new EnergyNode({ x, y });
        this.updatableEntities[this.currentEntityId] = newEnergyNode;
        this.drawableEntities[this.currentEntityId] = newEnergyNode;
        this.currentEntityId++;
    }
}; //States class
