<template>
    <div>
        <canvas id="hud-layer"></canvas>
        <canvas id="lineOfSight-layer"></canvas>
        <canvas id="lighting-layer"></canvas>
        <canvas id="main-layer"></canvas>
        <canvas id="background-layer"></canvas>
    </div>
</template>
<script>
// import socket io
// import game engine
export default {
    name: 'Game',
    data: function () {
        return {
            testVar: 'test Var Value'
        };
    },
    methods: {},

    mounted: function () {
        //disabled right-click menu
        window.addEventListener('contextmenu', (event) => event.preventDefault());
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
    cursor: none;
}
#stage {
    position: fixed;
    left: 0;
    top: 0;
    /*width:100%;
                height:100%;*/
    /*border: 1px solid white;*/
    /*margin: 0 auto;*/
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
    cursor: none;
}
#background-layer {
    z-index: 1;
    cursor: none;
}
</style>
