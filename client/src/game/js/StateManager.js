const Utilities = require('../shared/Utilities.js');
const Hitbox = require('../shared/Hitbox.js');
const EnergyNodeClass = require('./Entities/EnergyNode');
const PIXI = require('pixi.js');
// const QuadTree = require('./dataStructures/quadTree.js');
// const Rectangle = require('./dataStructures/rectangle.js');

module.exports = class StatesManager {
    constructor({ debug = false, debugState = false, engine = null }) {
        console.log('Create State Manager');
        this.debug = debug;
        this.debugState = debugState;
        this.ENGINE = engine;
        this.numberOfDrawLayers = 2;

        this.currentEntityId = 0;

        //world size for center quad tree is 10,000
        // this.quadTreeEntities = new QuadTree(new Rectangle(0, 0, 10000, 10000), 10);

        this.currentState = {
            entities: {}
        };
        this.previousState = {
            entities: {}
        };
        this.drawingState = {
            entities: {}
        };
        this.temp = { nearby: [], nearbyDraw: [] };
        this.entityAddedSinceLastDraw = true;
        this.cameraChange = true;
        this.lastCameraStatus = { x: this.ENGINE.CAMERA.x, y: this.ENGINE.CAMERA.y, zoomLevel: this.ENGINE.CAMERA.zoomLevel };

        //load saveGame from localStorage
        this.loadSaveGameFromStorage('savedGame');

        this.ENGINE.pixiApp.ticker.add((deltaTime) => {
            this.update(deltaTime);
        });
    } //constructor

    update(deltaTime) {
        // console.log(deltaTime);
        Object.entries(this.currentState.entities).forEach(([id, entity]) => {
            this.ENGINE.ENTITY_CLASSES[entity.type].update.bind(entity)(this.ENGINE, deltaTime);
        });
    }

    // draw(deltaTime) {
    //     //TODO only draw what is on the screen
    //     if (
    //         this.lastCameraStatus.x != this.ENGINE.CAMERA.x ||
    //         this.lastCameraStatus.y != this.ENGINE.CAMERA.y ||
    //         this.lastCameraStatus.zoomLevel != this.ENGINE.CAMERA.zoomLevel
    //     ) {
    //         this.lastCameraStatus = { x: this.ENGINE.CAMERA.x, y: this.ENGINE.CAMERA.y, zoomLevel: this.ENGINE.CAMERA.zoomLevel };
    //         this.cameraChange = true;
    //     }
    //     if (this.cameraChange || this.entityAddedSinceLastDraw) {
    //         this.getEntitiesInRange(
    //             this.temp.nearbyDraw,
    //             'drawable',
    //             this.ENGINE.CAMERA,
    //             Math.max(this.ENGINE.CAMERA.worldViewWidth, this.ENGINE.CAMERA.worldViewHeight) / 2 // / this.ENGINE.CAMERA.zoomLevel
    //         );
    //         this.entityAddedSinceLastDraw = false;
    //         this.cameraChange = false;
    //         // if (this.ENGINE.HUD.debug) {
    //         //     this.ENGINE.HUD.debugUpdate({
    //         //         entitiesBeingDrawn: this.temp.nearbyDraw.length
    //         //     });
    //         // }
    //     }
    //     for (let i = 0; i < this.numberOfDrawLayers; i++) {
    //         Object.entries(this.temp.nearbyDraw).forEach(([id, entity]) => {
    //             if (this.ENGINE.ENTITY_CLASSES[entity.type][`draw${i}`])
    //                 this.ENGINE.ENTITY_CLASSES[entity.type][`draw${i}`].bind(entity)(this.ENGINE, deltaTime);
    //         });
    //     }
    //     // let drawingState = this.getIntermediateState(deltaTime);
    //     // if (drawingState == null) return;
    // } //draw

    getIntermediateState(deltaTime) {} // getIntermediateState

    placeEnergyNode({ x = this.ENGINE.CONTROLS.mouseLocationInWorld.x, y = this.ENGINE.CONTROLS.mouseLocationInWorld.y } = {}) {
        if (this.ENGINE.HUD.ghost != null) {
            let point = this.ENGINE.HUD.ghost.toGlobal({ x: 0, y: 0 });
            this.ENGINE.CONTROLS.translateScreenLocToWorld(point, point.x, point.y);
            x = point.x;
            y = point.y;
        }
        console.log('placeEnergyNode', x, y);

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
            this.entityAddedSinceLastDraw = true;
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
            id = Number(id);
            // console.log('entity.x, typeof entity.x :>> ', entity.x, typeof entity.x);
            if (this.currentEntityId <= id) this.currentEntityId = id + 1;
            // console.log('this.currentEntityId :>> ', this.currentEntityId, typeof this.currentEntityId);
            this.ENGINE.ENTITY_CLASSES[entity.type].restoreFromSave(this, entity);
            if (this.debug) entity.debug = true;
        });
        console.log('this.currentEntityId :>> ', this.currentEntityId);
    }
}; //States class
