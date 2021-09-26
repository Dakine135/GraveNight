const Utilities = require('../shared/Utilities.js');
const Hitbox = require('../shared/Hitbox.js');
const EnergyNodeClass = require('./Entities/EnergyNode');

module.exports = class StatesManager {
    constructor({ debug = false, debugState = false, engine = null }) {
        console.log('Create State Manager');
        this.debug = debug;
        this.debugState = debugState;
        this.ENGINE = engine;
        this.numberOfDrawLayers = 2;

        this.currentEntityId = 0;

        this.currentState = {
            entities: {}
        };
        this.previousState = {
            entities: {}
        };
        this.drawingState = {
            entities: {}
        };
        this.temp = { nearby: [] };

        //load saveGame from localStorage
        this.loadSaveGameFromStorage('savedGame');
    } //constructor

    update(deltaTime) {
        Object.entries(this.currentState.entities).forEach(([id, entity]) => {
            this.ENGINE.ENTITY_CLASSES[entity.type].update.bind(entity)(this.ENGINE, deltaTime);
        });
    }

    draw(deltaTime) {
        //TODO only draw what is on the screen
        for (let i = 0; i < this.numberOfDrawLayers; i++) {
            Object.entries(this.currentState.entities).forEach(([id, entity]) => {
                if (this.ENGINE.ENTITY_CLASSES[entity.type][`draw${i}`])
                    this.ENGINE.ENTITY_CLASSES[entity.type][`draw${i}`].bind(entity)(this.ENGINE, deltaTime);
            });
        }
        // let drawingState = this.getIntermediateState(deltaTime);
        // if (drawingState == null) return;
    } //draw

    getIntermediateState(deltaTime) {} // getIntermediateState

    placeEnergyNode({ x = this.ENGINE.CONTROLS.mouseLocationInWorld.x, y = this.ENGINE.CONTROLS.mouseLocationInWorld.y } = {}) {
        // console.log('placeEnergyNode');
        if (this.ENGINE.HUD.ghost != null) {
            (x = this.ENGINE.HUD.ghost.x), (y = this.ENGINE.HUD.ghost.y);
        }

        //get other Nodes
        //hard coded distance node radius at this time is 12
        //distance can link is 100
        this.getEntitiesInRange(this.temp.nearby, 'energyLinkableEntities', { x, y }, 50);
        this.temp.canBePlaced = true;
        this.temp.overlapping = false;
        this.temp.nearby.forEach((otherNode) => {
            this.temp.overlapping = Hitbox.collideCircleCircle(
                { x, y, r: 12 },
                { x: otherNode.x, y: otherNode.y, r: this.ENGINE.ENTITY_CLASSES['EnergyNode'].radius }
            );
            if (this.temp.overlapping) this.temp.canBePlaced = false;
        });

        if (this.temp.canBePlaced) {
            let newEnergyNode = EnergyNodeClass.new({ id: this.currentEntityId, x, y, ENGINE: this.ENGINE });
            this.currentState.entities[this.currentEntityId] = newEnergyNode;
            this.currentEntityId++;
        } else {
            // console.log('Something is in the way');
        }
    }

    getEntitiesInRange(result, type, point, distance) {
        //TODO use quad tree here to speed things along
        result.length = 0;

        Object.entries(this.currentState.entities).forEach(([id, entity]) => {
            //TODO only add ones that match Type
            if (Utilities.dist(point, { x: entity.x, y: entity.y }) <= distance) result.push(entity);
        });
    }

    saveGameStateToStorage() {
        console.log('this.currentState :>> ', this.currentState);
        let entities = {};
        Object.entries(this.currentState.entities).forEach(([id, entity]) => {
            entities[id] = this.ENGINE.ENTITY_CLASSES[entity.type].toJSON.bind(entity)();
        });
        localStorage.setItem('savedGame', JSON.stringify({ entities }));
    }

    loadSaveGameFromStorage(saveGameName) {
        console.log('loadSaveGameFromStorage :>> ', saveGameName);
        const saveGameString = localStorage.getItem(saveGameName);
        if (saveGameString == null) return;
        this.currentState = JSON.parse(saveGameString);
        Object.entries(this.currentState.entities).forEach(([id, entity]) => {
            if (this.currentEntityId <= id) this.currentEntityId = id + 1;
            this.ENGINE.ENTITY_CLASSES[entity.type].restoreFromSave(this, entity);
        });
        console.log('this.currentEntityId :>> ', this.currentEntityId);
    }
}; //States class
