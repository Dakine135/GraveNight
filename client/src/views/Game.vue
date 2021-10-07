<template>
    <div>
        <div id="stage" ref="stage">
            <canvas id="hud-layer" ref="hud-layer">Your browser does not support HTML5 canvas</canvas>
            <!-- <canvas id="lineOfSight-layer" ref="lineOfSight-layer"></canvas> -->
            <canvas id="lighting-layer" ref="lighting-layer"></canvas>
            <div id="main-layer" ref="main-layer"></div>
            <canvas id="background-layer" ref="background-layer"></canvas>
        </div>
    </div>
</template>
<script>
// import socket io
// import game engine
import EngineClass from '../game/js/clientEngine.js';
// import * as PIXI from 'pixi.js';
console.log('Game Route');
export default {
    name: 'Game',
    data: function () {
        return {
            engine: null
            // screenWidth: window.innerWidth,
            // screenHeight: window.innerHeight
        };
    },
    methods: {
        setup() {
            console.log('SETUP');
        }, //SETUP

        draw() {
            this.engine.update();
            this.engine.draw();
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
        })();

        //main layer Pixi JS

        // The application will create a canvas element for you that you
        // can then insert into the DOM
        let mainLayerDiv = this.$refs['main-layer'];
        // console.log('mainLayerPixi :>> ', mainLayerPixi);

        let stage = this.$refs['stage'];
        let backgroundCanvas = this.$refs['background-layer'];
        let lightingCanvas = this.$refs['lighting-layer'];
        let lineOfSightCanvas = this.$refs['lineOfSight-layer'];
        let hudCanvas = this.$refs['hud-layer'];
        this.engine = new EngineClass({
            pixiAppDiv: mainLayerDiv,
            stage,
            backgroundCanvas,
            lightingCanvas,
            lineOfSightCanvas,
            hudCanvas
            // width: this.screenWidth,
            // height: this.screenHeight
        });
        //disabled right-click menu
        window.addEventListener('contextmenu', (event) => event.preventDefault());
        this.setup();
        this.draw();
    }
};
</script>
<style scoped>
/*Disabled scrolling*/
html,
body {
    overflow: hidden;
    background: black;
}
/*Stuff to make the full screen better and remove cursor*/
canvas {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    /* cursor: none; */
}
#stage {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    /*border: 1px solid white;*/
    margin: 0 auto;
}
#hud-layer {
    z-index: 5;
}
#lineOfSight-layer {
    z-index: 4;
}
#lighting-layer {
    z-index: 3;
}
#main-layer {
    z-index: 2;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    /* cursor: none; */
}
#background-layer {
    z-index: 1;
    /* cursor: none; */
}
</style>
