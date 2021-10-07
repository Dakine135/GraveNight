<template>
    <div>
        <div id="pixiContainer" ref="pixiContainer">
            <!-- <canvas id="pixiCanvas" ref="pixiCanvas"></canvas> -->
        </div>
    </div>
</template>
<script>
import * as PIXI from 'pixi.js';
console.log('Pixi Test Route');
export default {
    name: 'PixiTest',
    data: function () {
        return {
            elapsed: 0.0,
            logo: null,
            app: null
        };
    },
    methods: {
        setup() {
            console.log('SETUP Pixi');
            // Get the global position of an object, relative to the top-left of the screen
            // let globalPos = obj.toGlobal(new PIXI.Point(0,0));
            // load the texture we need
            console.log('this.app :>> ', this.app);
            let logoSource = require('@assets/GNHandLogo256.png');
            this.app.loader.add('GNHandLogo', logoSource).load((loader, resources) => {
                // This creates a texture from a 'logo.png' image
                // this.logo = new PIXI.Sprite(resources.GNHandLogo.texture);
                // Setup the position of the logo
                // this.logo.x = this.app.screen.width / 2;
                // this.logo.y = this.app.screen.height / 2;
                // Rotate around the center
                // this.logo.anchor.x = 0.5;
                // this.logo.anchor.y = 0.5;
                // Add the logo to the scene we are building
                // this.app.stage.addChild(this.logo);

                const graphics = new PIXI.Graphics();
                // Circle
                graphics.lineStyle(0); // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
                graphics.beginFill(0xde3249, 1);
                graphics.drawCircle(100, 250, 50);
                graphics.endFill();
                this.app.stage.addChild(graphics);

                // Listen for frame updates
                this.app.ticker.add((deltaTime) => {
                    this.elapsed += deltaTime;
                    // each frame we spin the logo around a bit
                    // logo.rotation += Math.cos(this.elapsed / 1000.0) * 360;
                });
            }); //loader
        }, //SETUP

        draw() {
            if (this.logo) this.logo.rotation += 0.1;
            window.requestAnimFrame(this.draw);
        } //draw
    },

    mounted: function () {
        window.requestAnimFrame = (function (callback) {
            return (
                window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                }
            );
        })(); //window RequestFrame

        // The application will create a renderer using WebGL, if possible,
        // with a fallback to a canvas render. It will also setup the ticker
        // and the root stage PIXI.Container
        this.app = new PIXI.Application({ width: 500, height: 500 });

        // The application will create a canvas element for you that you
        // can then insert into the DOM
        let pixiContainer = this.$refs['pixiContainer'];
        console.log('pixiContainer :>> ', pixiContainer);
        pixiContainer.appendChild(this.app.view);
        // document.body.appendChild(app.view);

        this.setup();
        this.draw();
    } //mounted
};
</script>
<style scoped>
#pixiContainer {
    background: white;
}
</style>
