const Utilities = require('../shared/Utilities.js');
const Grid = require('../shared/Grid.js');
const World = require('../shared/World.js');
const PIXI = require('pixi.js');

module.exports = class background {
    constructor({ debug = false, engine = null }) {
        this.debug = debug;
        this.ENGINE = engine;

        //assets
        // this.spriteSheetSize = 64;
        // this.grassSpriteSheet = new Image();
        // this.grassSpriteSheet.src = require('../../assets/grassTiles64.png');
        // this.grassSpriteSheet.onload = () => {
        //     this.imageLoaded = true;
        //     this.generateSpriteGrid();
        // };
        this.backgroundContainer = new PIXI.Container();
        this.backgroundContainer.name = 'background';
        this.backgroundContainer.zIndex = 0;
        this.ENGINE.pixiApp.stage.addChild(this.backgroundContainer);

        this.ENGINE.pixiApp.loader.add('grassSpriteSheet', 'assets/background/grass.json').load(this.setup.bind(this));

        console.log('Created background-layer', this.ENGINE.width, this.ENGINE.height);
    } //constructor

    setup(loader, resources) {
        console.log('background SETUP');
        /**
         * 0 = solidGrass
         * 1 = largeGrassCircle
         * 2 = smallGrassCircle
         * 3 = dirtWithRocks
         * 4 = dirt
         * 5 = grassWithPlant
         * 6 =
         * 7 =
         * 8 =
         * 9 =
         * 10 = largeDirtCircle
         * 11 = blank
         * 12 =
         * 13 =
         * 14 =
         * 15 =
         * 16 =
         * 17 =
         */

        //testing displays all sprite sheet
        // for (let i = 0; i < 18; i++) {
        //     const texture = new PIXI.Texture.from(`grassTiles64-${i}.png`);
        //     const sprite = new PIXI.Sprite(texture);
        //     sprite.x = i * 64;
        //     sprite.y = 0;
        //     this.backgroundContainer.addChild(sprite);
        // }

        const texture = new PIXI.Texture.from(`grassTiles64-${0}.png`);
        const sprite = new PIXI.TilingSprite(texture, this.ENGINE.width, this.ENGINE.height);
        // sprite.x = i * 64;
        // sprite.y = 0;
        this.backgroundContainer.addChild(sprite);

        // // add it to the stage
    }

    // updateWithWorldData(WORLD) {
    //     this.worldLoaded = true;
    //     this.ENGINE.WORLD = WORLD;
    //     // this.offscreenCanvas.width  = this.ENGINE.WORLD.width;
    //     // this.offscreenCanvas.height = this.ENGINE.WORLD.height;
    //     this.generateSpriteGrid();
    // }

    // generateSpriteGrid() {
    //     //TODO i think a good optimization would be to render chunks of the background to some off-screen canvases so that can be drawn in one go, instead of drawing ever sprite image separately every time
    //     if (this.backgroundGenerated || !this.worldLoaded || !this.imageLoaded) return;
    //     this.backgroundGenerated = true;
    //     let numOfColumns = this.ENGINE.WORLD.width / this.ENGINE.WORLD.gridSize;
    //     let numOfRows = this.ENGINE.WORLD.height / this.ENGINE.WORLD.gridSize;
    //     //go through and set inital grass
    //     for (let column = 0; column < numOfColumns; column++) {
    //         for (let row = 0; row < numOfRows; row++) {
    //             if (this.spriteGrid[column] === undefined) this.spriteGrid[column] = [];
    //             if (this.spriteGrid[column][row] === undefined) this.spriteGrid[column][row] = {};
    //             if (this.spriteGrid[column][row].lock === true) continue;
    //             let tileTypeRan = Math.random() * 1000;
    //             if (tileTypeRan >= 900) {
    //                 //full grass with leaf
    //                 let leafRotation = Math.random();
    //                 if (leafRotation < 0.25) this.setSprite({ column: column, row: row, spriteX: 5, spriteY: 0, rotate: Math.PI });
    //                 else if (leafRotation < 0.5) this.setSprite({ column: column, row: row, spriteX: 5, spriteY: 0, rotate: Math.PI / 2 });
    //                 else if (leafRotation < 0.75)
    //                     this.setSprite({ column: column, row: row, spriteX: 5, spriteY: 0, rotate: -Math.PI / 2 });
    //                 else this.setSprite({ column: column, row: row, spriteX: 5, spriteY: 0 });
    //             } else {
    //                 //full grass
    //                 this.setSprite({ column: column, row: row, spriteX: 0, spriteY: 0 });
    //             }
    //         } //for rows
    //     } //for columns

    //     //go through in 3x3 chunks and replace sections with sprites that go together
    //     let chunkSize = 3; //square
    //     for (let column = 0; column < numOfColumns - chunkSize; column += chunkSize) {
    //         for (let row = 0; row < numOfRows - chunkSize; row += chunkSize) {
    //             if (this.checkGridGroupLock(column, row, chunkSize)) continue;
    //             let tileTypeRan = Math.random() * 1000;
    //             if (tileTypeRan >= 900) {
    //                 //grass circle patch
    //                 //top row
    //                 if (Math.random() <= 0.5) this.setSprite({ column: column, row: row, lock: true, spriteX: 3, spriteY: 2 });
    //                 this.setSprite({ column: column + 1, row: row, lock: true, spriteX: 4, spriteY: 2, rotate: Math.PI / 2 });
    //                 if (Math.random() <= 0.5) this.setSprite({ column: column + 2, row: row, lock: true, spriteX: 2, spriteY: 2 });
    //                 //middle row
    //                 this.setSprite({ column: column, row: row + 1, lock: true, spriteX: 4, spriteY: 2 });
    //                 let middleType = Math.random();
    //                 if (middleType < 0.25) this.setSprite({ column: column + 1, row: row + 1, lock: true, spriteX: 3, spriteY: 0 });
    //                 else if (middleType < 0.4) this.setSprite({ column: column + 1, row: row + 1, lock: true, spriteX: 4, spriteY: 0 });
    //                 else this.setSprite({ column: column + 1, row: row + 1, lock: true, spriteX: 2, spriteY: 0 });
    //                 this.setSprite({ column: column + 2, row: row + 1, lock: true, spriteX: 4, spriteY: 2, rotate: Math.PI });
    //                 //bottom row
    //                 if (Math.random() <= 0.5)
    //                     this.setSprite({ column: column, row: row + 2, lock: true, spriteX: 2, spriteY: 2, rotate: Math.PI });
    //                 this.setSprite({ column: column + 1, row: row + 2, lock: true, spriteX: 4, spriteY: 2, rotate: -Math.PI / 2 });
    //                 if (Math.random() <= 0.5)
    //                     this.setSprite({ column: column + 2, row: row + 2, lock: true, spriteX: 3, spriteY: 2, rotate: Math.PI });
    //             } else if (tileTypeRan >= 800) {
    //                 //top
    //                 this.setSprite({ column: column + 1, row: row, lock: true, spriteX: 3, spriteY: 1, rotate: Math.PI / 2 });
    //                 //middle row
    //                 this.setSprite({ column: column, row: row + 1, lock: true, spriteX: 3, spriteY: 1 });
    //                 this.setSprite({ column: column + 1, row: row + 1, lock: true, spriteX: 4, spriteY: 1 });
    //                 this.setSprite({ column: column + 2, row: row + 1, lock: true, spriteX: 3, spriteY: 1, rotate: Math.PI });
    //                 //bottom row
    //                 this.setSprite({ column: column + 1, row: row + 2, lock: true, spriteX: 3, spriteY: 1, rotate: -Math.PI / 2 });
    //             } else {
    //                 //don't do anything for chunk
    //             }
    //         } //for rows
    //     } //for columns
    // } //generateBackGroundImage

    // //returns true if any cell in group is locked, otherwise false
    // checkGridGroupLock(column, row, size) {
    //     // console.log(column, row, size);
    //     let maxX = column + size;
    //     let maxY = row + size;
    //     for (let x = column; x < maxX; x++) {
    //         for (let y = row; y < maxY; y++) {
    //             if (this.spriteGrid[x][y].lock) return true;
    //         }
    //     }
    //     return false;
    // } //checkGridGroupLock

    // setSprite({ column, row, spriteX = 0, spriteY = 0, rotate = 0, lock = false }) {
    //     this.spriteGrid[column][row].x = spriteX;
    //     this.spriteGrid[column][row].y = spriteY;
    //     this.spriteGrid[column][row].rotate = rotate;
    //     this.spriteGrid[column][row].lock = lock;
    // } //setSprite

    // resize() {

    // }

    // //input world cords and get sprite offset that should be used.
    // getImageOffset(x, y, debug) {
    //     // console.log("get sprite offset at world:", x, y);
    //     let spriteSheetX = Math.floor(x / this.ENGINE.gridSize + this.spriteGrid.length / 2);
    //     let spriteSheetY = Math.floor(y / this.ENGINE.gridSize + this.spriteGrid[0].length / 2);
    //     if (spriteSheetX < 0 || spriteSheetX >= this.spriteGrid.length) {
    //         spriteSheetX = 0;
    //     }
    //     if (spriteSheetY < 0 || spriteSheetY >= this.spriteGrid[0].length) {
    //         spriteSheetY = 0;
    //     }
    //     // console.log(`${x}=>${spriteSheetX},${y}=>${spriteSheetY}: ${imageOffset}`);
    //     // console.log(spriteSheetX, spriteSheetY, this.spriteGrid.length);
    //     // console.log(imageOffset);
    //     if (debug) return { x: spriteSheetX, y: spriteSheetY };
    //     return this.spriteGrid[spriteSheetX][spriteSheetY];
    // }

    // update() {}

    // draw() {
    //     if (!this.worldLoaded || !this.imageLoaded || !this.backgroundGenerated || this.ENGINE.CAMERA.zoomLevel <= 0.5) {
    //         this.render.save();
    //         this.render.setTransform(1, 0, 0, 1, 0, 0);
    //         this.render.fillStyle = '#3c9f4c';
    //         // this.render.fillStyle = 'lightgrey';
    //         this.render.fillRect(0, 0, this.canvas.width, this.canvas.height);
    //         this.render.restore();
    //         return;
    //     }
    //     if (this.ENGINE.CAMERA.cameraMovedSinceLastUpdate == false && !this.firstDraw) {
    //         // console.log('skipping background Draw');
    //         return;
    //     }
    //     this.firstDraw = false;
    //     if (this.debug) {
    //         let imageOffset = this.getImageOffset(this.ENGINE.CAMERA.x, this.ENGINE.CAMERA.y, true);
    //         // this.HUD.debugUpdate({
    //         //     imageOffset: `${this.ENGINE.CAMERA.x}=>${imageOffset.x},${this.ENGINE.CAMERA.y}=>${imageOffset.y}`
    //         // });
    //     }

    //     // let x = 0;
    //     // let y = 0;
    //     // let offsetX;
    //     // let offsetY;ssssss
    //     // let imageOffset;
    //     for (
    //         let offsetX = -this.ENGINE.gridSize - (this.ENGINE.CAMERA.x % this.ENGINE.gridSize);
    //         offsetX < this.ENGINE.CAMERA.worldViewWidth;
    //         offsetX += this.ENGINE.gridSize
    //     ) {
    //         // y = 0;
    //         for (
    //             let offsetY = -this.ENGINE.gridSize - (this.ENGINE.CAMERA.y % this.ENGINE.gridSize);
    //             offsetY < this.ENGINE.CAMERA.worldViewHeight;
    //             offsetY += this.ENGINE.gridSize
    //         ) {
    //             let imageOffset = this.getImageOffset(this.ENGINE.CAMERA.x + offsetX, this.ENGINE.CAMERA.y + offsetY);
    //             this.render.save();
    //             //TODO background might need some zoom love
    //             this.render.scale(this.ENGINE.CAMERA.zoomLevel, this.ENGINE.CAMERA.zoomLevel);
    //             this.render.translate(offsetX + this.ENGINE.gridSize / 2, offsetY + this.ENGINE.gridSize / 2);
    //             this.render.rotate(imageOffset.rotate);
    //             this.render.translate(-(this.ENGINE.gridSize / 2), -(this.ENGINE.gridSize / 2));
    //             this.render.drawImage(
    //                 this.grassSpriteSheet, //image source
    //                 imageOffset.x * this.spriteSheetSize, //cord x to clip source
    //                 imageOffset.y * this.spriteSheetSize, //cord y to clip source
    //                 this.spriteSheetSize,
    //                 this.spriteSheetSize, //width and height of source
    //                 0,
    //                 0, //cord x and y to paste on canvas
    //                 this.ENGINE.gridSize,
    //                 this.ENGINE.gridSize //size of paste (can stretch or reduce image)
    //             );
    //             this.render.restore();
    //             // y++;
    //         } //height
    //         // x++;
    //     } //width
    // } //draw
}; //background class
