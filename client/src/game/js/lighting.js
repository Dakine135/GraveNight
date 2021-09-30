const Hitbox = require('../shared/Hitbox.js');
const Utilities = require('../shared/Utilities.js');

// import LineOfSightWorker from 'worker-loader!./lineOfSightWorker.js';
// const LineOfSightWorker = require('./lineOfSight.worker.js');

module.exports = class lighting {
    constructor({ debug = false, engine = null, darkness = 0.9, brightness = 0.9, canvas = null }) {
        this.ENGINE = engine;
        this.darkness = darkness;
        this.brightness = brightness;
        if (debug) {
            this.darkness = darkness * 0.8;
            this.brightness = brightness * 0.8;
        }
        this.canvas = canvas;
        this.canvas.width = this.ENGINE.width;
        this.canvas.height = this.ENGINE.height;
        this.render = this.canvas.getContext('2d');
        //main offscreen that compiles the lighting
        this.offscreenCanvas = document.createElement('canvas');
        this.offscreenCanvas.width = this.ENGINE.width;
        this.offscreenCanvas.height = this.ENGINE.height;
        this.offscreenRender = this.offscreenCanvas.getContext('2d');
        this.debug = debug;
        this.lightSources = {};

        this.temp = {
            translatedLocation: { x: 0, y: 0 }
        };

        //testing
        this.skipAmount = 30;
        this.drawSkipsLeft = 0;

        console.log('Created lighting-layer', this.ENGINE.width, this.ENGINE.height);
    } //constructor

    resize({ width, height, renderDistance }) {
        this.ENGINE.width = width;
        this.ENGINE.height = height;
        this.canvas.width = this.ENGINE.width;
        this.canvas.height = this.ENGINE.height;
        this.offscreenCanvas.width = this.ENGINE.width;
        this.offscreenCanvas.height = this.ENGINE.height;
        // this.flashlightGlowCanvas.width = this.ENGINE.width;
        // this.flashlightGlowCanvas.height = this.ENGINE.height;
        // this.flashlightConeCanvas.width = this.ENGINE.width;
        // this.flashlightConeCanvas.height = this.ENGINE.height;
        this.ENGINE.renderDistance = renderDistance;
    }

    createLightSource({ id = 0, x = 0, y = 0, intensity = 100 }) {
        this.lightSources[id] = {
            id: id,
            x: x,
            y: y,
            intensity: intensity
        };
    } //create light source

    update(deltaTime) {
        if (this.debug) {
        }
    } //update

    draw() {
        // console.log("drawing lighting");

        this.render.globalCompositeOperation = 'source-over';
        this.offscreenRender.globalCompositeOperation = 'source-over';

        //clear the canvas
        this.render.save();
        this.render.setTransform(1, 0, 0, 1, 0, 0);
        this.render.clearRect(0, 0, this.ENGINE.width, this.ENGINE.height);
        this.render.beginPath();
        this.render.restore();

        //fill black
        this.render.save();
        this.render.fillStyle = 'rgba(0, 0, 0,' + this.darkness + ')';
        this.render.fillRect(0, 0, this.ENGINE.width, this.ENGINE.height);
        this.render.restore();

        //draw lights for the energy nodes
        // this.offscreenRender.fillStyle = 'white';
        this.offscreenRender.save();
        if (this.drawSkipsLeft == 0) {
            //clear the offscreen canvas
            this.offscreenRender.setTransform(1, 0, 0, 1, 0, 0);
            this.offscreenRender.clearRect(0, 0, this.ENGINE.width, this.ENGINE.height);
            this.offscreenRender.beginPath();
            this.ENGINE.CAMERA.translate(this.temp.translatedLocation, 0, 0);
            this.offscreenRender.translate(this.temp.translatedLocation.x, this.temp.translatedLocation.y);
            this.offscreenRender.scale(this.ENGINE.CAMERA.zoomLevel, this.ENGINE.CAMERA.zoomLevel);
            this.ENGINE.STATES.temp.nearbyDraw.forEach((entity) => {
                if ((entity.type = 'EnergyNode')) {
                    this.offscreenRender.beginPath();
                    this.temp.lightIntensity = Utilities.mapNum(entity.heat, 0, 1000, 100, 300);
                    this.temp.gradientRest = this.offscreenRender.createRadialGradient(
                        entity.x,
                        entity.y,
                        this.temp.lightIntensity * 0.2,
                        entity.x,
                        entity.y,
                        this.temp.lightIntensity
                    );
                    this.temp.gradientRest.addColorStop(0, 'rgba(255, 255, 255, ' + this.brightness + ')');
                    this.temp.gradientRest.addColorStop(0.9, 'rgba(255, 255, 255, ' + this.brightness * 0.3 + ')');
                    this.temp.gradientRest.addColorStop(1, 'rgba(255, 255, 255, 0)');
                    this.offscreenRender.fillStyle = this.temp.gradientRest;
                    this.offscreenRender.arc(entity.x, entity.y, this.temp.lightIntensity, 0, Math.PI * 2);
                    this.offscreenRender.fill();
                    this.offscreenRender.closePath();
                }
            });
            this.drawSkipsLeft = this.skipAmount;
        }
        this.drawSkipsLeft--;

        this.offscreenRender.restore();

        //draw light sources
        // for(var id in this.lightSources){
        // 	let light = this.lightSources[id];
        // 	this.drawLightPoint({
        // 		x:light.x,
        // 		y:light.y,
        // 		intensity:light.intensity
        // 	});
        // }// for every light source

        this.render.globalCompositeOperation = 'xor';
        this.render.drawImage(this.offscreenCanvas, 0, 0);
    } //draw

    addGlowingObject({ intensity, obj }) {
        if (obj == null) return;
        //TODO technically this is applied per frame and will be effected by frame rate
        intensity = intensity / 20;
        if (this.objectsGlowing[obj.id] == null) {
            this.objectsGlowing[obj.id] = {
                x: obj.x,
                y: obj.y,
                intensity: intensity,
                alreadyHit: true
            };
        } else {
            if (!this.objectsGlowing[obj.id].alreadyHit) {
                this.objectsGlowing[obj.id].alreadyHit = true;
                this.objectsGlowing[obj.id].intensity += intensity;
                if (this.objectsGlowing[obj.id].intensity > 1000) this.objectsGlowing[obj.id].intensity = 1000;
            }
        }
    } //add glowing objects

    drawLightPoint({
        x,
        y,
        intensity,
        brightness = this.brightness,
        darkness = this.darkness,
        lineOfSight = null,
        offset = { x: 0, y: 0 },
        canvas = this.offscreenCanvas,
        render = this.offscreenRender
    }) {
        // console.log("lightdraw:",intensity);
        if (intensity <= 0) {
            return;
        }

        let originPTrans = { x: 0, y: 0 };
        this.ENGINE.CAMERA.translate(originPTrans, x, y);

        // let offsetX = Math.round(offset.x - this.ENGINE.CAMERA.x);
        // let offsetY = Math.round(offset.y - this.ENGINE.CAMERA.y);

        // //draw full line-of-Sight
        // if (lineOfSight) {
        //     render.save();
        //     render.fillStyle = 'white';
        //     render.translate(offsetX, offsetY);
        //     render.fill(lineOfSight);
        //     render.restore();
        // }
        //glow gradient
        let gradientRest = render.createRadialGradient(
            originPTrans.x,
            originPTrans.y,
            intensity * 0.2,
            originPTrans.x,
            originPTrans.y,
            intensity
        );
        gradientRest.addColorStop(0, 'rgba(255, 255, 255, ' + brightness + ')');
        gradientRest.addColorStop(0.9, 'rgba(255, 255, 255, ' + brightness * 0.3 + ')');
        gradientRest.addColorStop(1, 'rgba(255, 255, 255, 0)');
        //only keep what over-laps
        if (lineOfSight) render.globalCompositeOperation = 'source-in';
        render.arc(originPTrans.x, originPTrans.y, intensity, 0, Math.PI * 2);
        render.fillStyle = gradientRest;
        render.fill();

        //apply glow canvas to main lighting offscreen canvas
        this.offscreenRender.shadowBlur = 32;
        this.offscreenRender.shadowColor = 'rgba(255, 255, 255, 1)';
        this.offscreenRender.drawImage(canvas, 0, 0);
        //clear the canvas
        render.globalCompositeOperation = 'source-over';
        render.save();
        render.setTransform(1, 0, 0, 1, 0, 0);
        render.clearRect(0, 0, this.ENGINE.width, this.ENGINE.height);
        render.beginPath();
        render.restore();
    } //draw light point

    /*
     */
    drawLightCone({
        x,
        y,
        angle,
        width = Math.PI * 0.5,
        intensity,
        brightness = this.brightness,
        darkness = this.darkness,
        lineOfSight,
        offset,
        canvas = null,
        render = null
    }) {
        if (intensity <= 0) {
            return;
        }
        let origin = {
            x: Math.round(x),
            y: Math.round(y)
        };

        let originPTrans = this.ENGINE.CAMERA.translate(origin);

        let startAngle = angle - width / 2;
        if (startAngle < 0) startAngle = startAngle + Math.PI * 2;
        let endAngle = startAngle + width;
        if (endAngle > Math.PI * 2) endAngle = endAngle - Math.PI * 2;
        let startPoint = this.ENGINE.CAMERA.rotatePoint({
            center: origin,
            point: { x: origin.x + intensity, y: origin.y },
            angle: startAngle
        });
        let endPoint = this.ENGINE.CAMERA.rotatePoint({
            center: origin,
            point: { x: origin.x + intensity, y: origin.y },
            angle: endAngle
        });

        let viewPointStart = this.getViewPoint({
            point: startPoint,
            color: 'yellow',
            name: 'Start',
            origin: origin
        });

        let viewPointEnd = this.getViewPoint({
            point: endPoint,
            color: 'yellow',
            name: 'End',
            origin: origin
        });

        let offsetX = Math.round(offset.x - this.ENGINE.CAMERA.x);
        let offsetY = Math.round(offset.y - this.ENGINE.CAMERA.y);

        //draw full line-of-Sight
        render.save();
        render.fillStyle = 'white';
        // let cameraTranslate = this.ENGINE.CAMERA.translate({});
        render.translate(offsetX, offsetY);
        if (this.debug) {
            this.render.save();
            this.render.translate(offsetX, offsetY);
            this.render.strokeStyle = 'white';
            this.render.stroke(lineOfSight);
            this.render.restore();
        }
        render.fill(lineOfSight);
        render.restore();
        //cone gradient
        let gradient = render.createRadialGradient(
            originPTrans.x,
            originPTrans.y,
            intensity * 0.2,
            originPTrans.x,
            originPTrans.y,
            intensity
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, ' + brightness + ')');
        gradient.addColorStop(0.7, 'rgba(255, 255, 255, ' + brightness * 0.3 + ')');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        //only keep what over-laps
        render.globalCompositeOperation = 'source-in';
        render.beginPath();
        render.moveTo(viewPointEnd.x, viewPointEnd.y);
        render.lineTo(originPTrans.x, originPTrans.y);
        render.lineTo(viewPointStart.x, viewPointStart.y);
        render.arc(originPTrans.x, originPTrans.y, intensity, viewPointStart.angle, viewPointEnd.angle);
        render.fillStyle = gradient;
        render.fill();

        //apply cone canvas to main lighting offscreen canvas
        this.offscreenRender.shadowBlur = 32;
        this.offscreenRender.shadowColor = 'rgba(255, 255, 255, 1)';
        this.offscreenRender.drawImage(canvas, 0, 0);
        //clear the canvas
        render.globalCompositeOperation = 'source-over';
        render.save();
        render.setTransform(1, 0, 0, 1, 0, 0);
        render.clearRect(0, 0, this.ENGINE.width, this.ENGINE.height);
        render.beginPath();
        render.restore();
    } //drawLightCone

    getViewPoint({ point, edge = false, color = 'yellow', name = 'No Name', origin }) {
        let pAngle = this.calculateAngle({
            point1: point,
            centerPoint: origin
        });
        //translate to point for display
        let viewPoint = this.ENGINE.CAMERA.translate(point);
        viewPoint.edge = edge;
        viewPoint.color = color;
        viewPoint.angle = pAngle;
        viewPoint.name = name;
        return viewPoint;
    }

    calculateAngle({ point1, point2 = null, centerPoint }) {
        if (point2 == null) point2 = { x: centerPoint.x + 10, y: centerPoint.y };
        let pAngle = Utilities.calculateAngle({
            point1: point1,
            point2: point2,
            centerPoint: centerPoint
        });
        // if(pAngle < 0) pAngle = pAngle + Math.PI*2;
        if (pAngle < 0) pAngle = Math.abs(pAngle);
        // if(pAngle > Math.PI) pAngle = Math.PI - pAngle;
        // if(pAngle > width) pAngle = Math.PI*2 - pAngle;
        //Could cause an issue when cone is wider than PI aka 180, maybe?
        return pAngle;
    }

    /*
	Returns canvas path of the line of sight polygon, relative to canvas, not world
	*/
    getLineOfSightPath({ listOfPoints, origin, distance }) {
        listOfPoints.sort((a, b) => {
            return a.angle - b.angle;
        });

        // console.log(listOfPoints.length);
        if (this.debug) {
            this.ENGINE.HUD.debugUpdate({
                numberOfPoints: listOfPoints.length
            });
        }

        // create Path of line-of-sight
        let lineOfSight = new Path2D();
        let index = 0; //debug
        let lastPoint = listOfPoints[0];

        //run through all points
        listOfPoints.forEach((point) => {
            //main draw from point to point
            if (lastPoint.edge && point.edge) {
                //curve instead of line
                lineOfSight.arc(origin.x, origin.y, distance, lastPoint.angle, point.angle);
            } else {
                lineOfSight.lineTo(point.x, point.y);
            }

            lastPoint = point;
        }); //for each point

        if (listOfPoints.length === 0) {
            lineOfSight.arc(origin.x, origin.y, distance, 0, Math.PI * 2);
        } else {
            //complete path from first and last point
            if (lastPoint.edge && listOfPoints[0].edge) {
                //curve instead of line
                lineOfSight.arc(origin.x, origin.y, distance, lastPoint.angle, listOfPoints[0].angle);
            } else {
                lineOfSight.moveTo(lastPoint.x, lastPoint.y);
                lineOfSight.lineTo(listOfPoints[0].x, listOfPoints[0].y);
            }
        }
        return lineOfSight;
    } //getLineOfSightPath
}; //lighting class
