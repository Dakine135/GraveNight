const Utilities = require('../shared/Utilities.js');
module.exports = class Camera {
    constructor({ x = 0, y = 0, engine = Utilities.error('engine not linked'), speed = 0.3, debug = false }) {
        this.x = x;
        this.y = y;
        this.engine = engine;
        this.debug = debug;
        this.goalX = x;
        this.goalY = y;
        this.speed = speed; //1 would be instant camera, percent to move each update toward player of remaining distance
        // this.currentZoomLevelIndex = 3;
        // this.zoomLevels = [4, 3, 2, 1, 0.8, 0.5, 0.2, 0.1]; //scale levels for  https://www.w3schools.com/jsref/canvas_scale.asp
        this.currentZoomLevelIndex = 0;
        this.zoomLevels = [1, 0.5]; //scale levels

        this.cameraMovedSinceLastUpdate = true;
    }

    zoomIn() {
        this.currentZoomLevelIndex--;
        if (this.currentZoomLevelIndex < 0) {
            this.currentZoomLevelIndex = 0;
        } else {
            this.engine.HUD.debugUpdate({ zoomLevel: this.zoomLevel });
            this.setGoal(this.engine.CONTROLS.mouseLocationInWorld.x, this.engine.CONTROLS.mouseLocationInWorld.y);
        }
    }

    zoomOut() {
        this.currentZoomLevelIndex++;
        if (this.currentZoomLevelIndex >= this.zoomLevels.length) {
            this.currentZoomLevelIndex = this.zoomLevels.length - 1;
        } else {
            this.engine.HUD.debugUpdate({ zoomLevel: this.zoomLevel });
            this.setGoal(this.engine.CONTROLS.mouseLocationInWorld.x, this.engine.CONTROLS.mouseLocationInWorld.y);
        }
    }

    get zoomLevel() {
        return this.zoomLevels[this.currentZoomLevelIndex];
    }

    goToOrigin() {
        this.goalX = 0;
        this.goalY = 0;
    }

    moveTo(x, y) {
        this.x = Math.round(x);
        this.y = Math.round(y);
    }

    setGoal(x, y) {
        this.goalX = Math.round(x);
        this.goalY = Math.round(y);
    }

    moveGoal(x, y) {
        this.setGoal(this.goalX + x, this.goalY + y);
    }

    translate({ x = 0, y = 0 }) {
        let orgiginX = this.x - this.engine.width / 2;
        let orgiginY = this.y - this.engine.height / 2;
        let tx = Math.round(x - orgiginX);
        let ty = Math.round(y - orgiginY);
        return { x: tx, y: ty };
    }

    rotatePoint({ center = { x: 0, y: 0 }, point = { x: 0, y: 0 }, angle = 0 }) {
        let s = Math.sin(angle);
        let c = Math.cos(angle);

        //make copy
        let newPoint = { x: point.x, y: point.y };

        // translate point back to origin:
        newPoint.x -= center.x;
        newPoint.y -= center.y;

        // rotate point
        let xnew = newPoint.x * c - newPoint.y * s;
        let ynew = newPoint.x * s + newPoint.y * c;

        // translate point back:
        newPoint.x = xnew + center.x;
        newPoint.y = ynew + center.y;
        return newPoint;
    }

    update() {
        if (this.debug) this.moveTo(this.goalX, this.goalY);
        else {
            if (this.x == this.goalX && this.y == this.goalY) {
                this.cameraMovedSinceLastUpdate = false;
                return;
            }
            this.cameraMovedSinceLastUpdate = true;
            let diffX = this.x - this.goalX;
            let diffY = this.y - this.goalY;
            let moveX = this.x - diffX * this.speed;
            let moveY = this.y - diffY * this.speed;
            if (Math.abs(diffX) < 2) moveX = this.goalX;
            if (Math.abs(diffY) < 2) moveY = this.goalY;
            this.moveTo(moveX, moveY);
            this.engine.CONTROLS.updateCameraMoved();
        }
    }
}; //camera class
