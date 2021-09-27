<template>
    <div class="home">
        <el-row>
            <el-col>
                <div id="stage" class="stage" ref="stage">
                    <canvas id="titleCanvas" ref="titleCanvas">Your browser does not support HTML5 canvas</canvas>
                    <canvas id="lightLayer" ref="light-layer"></canvas>
                </div>
            </el-col>

            <!-- <div id="titleMain" hidden>
            <svg width="1600" height="400" ref="titleSVG">
                <image
                    xlink:href="@assets/banner-transp.svg"
                    src="banner-w.png"
                    alt="Gravenight Title SVG"
                    title="GraveNight Title"
                    width="1600"
                    height="400"
                />
            </svg>
        </div> -->

            <el-col>
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <h2 style="margin: 0; color: grey">Links</h2>
                    </div>
                    <div class="item">
                        <a href="https://www.patreon.com/DustinWelborn">
                            <img src="@assets/Patreon_logo.svg" alt="Github Logo" title="Github Logo" width="50" height="50" />
                            Patreon
                        </a>
                    </div>
                    <div class="item">
                        <a href="https://github.com/Dakine135/GraveNight">
                            <img src="@assets/logo-github.svg" alt="Github Logo" title="Github Logo" width="50" height="50" />
                            Github
                        </a>
                    </div>
                    <div class="item">
                        <a href="https://www.reddit.com/r/GraveNight/">
                            <img src="@assets/logo-reddit.svg" alt="Github Logo" title="Github Logo" width="50" height="50" />
                            Reddit
                        </a>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";

export default {
    name: 'Home',
    components: {
        // HelloWorld,
    },
    data: () => {
        return {
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            stage: null,
            titleCanvas: null,
            titleRender: null,
            lightCanvas: null,
            lightRender: null,
            titleImage: new Image(),
            titleImageClean: new Image(),
            imageReady: false,
            cleanimageReady: false,
            mouseX: null,
            mouseY: null
        };
    },
    methods: {
        setup() {
            console.log('Title Setup');
            this.titleRender.save();
            // this.titleRender.fillStyle = 'white';
            // this.titleRender.fillRect(0, 0, this.titleCanvas.width, this.titleCanvas.height);
            this.titleRender.clearRect(0, 0, this.titleCanvas.width, this.titleCanvas.height);
            this.titleRender.restore();
        }, //SETUP

        draw() {
            //draw main
            this.titleRender.save();
            this.titleRender.clearRect(0, 0, this.titleCanvas.width, this.titleCanvas.height);
            if (this.cleanimageReady) {
                let backgroundGradient = this.titleRender.createLinearGradient(0, 0, 0, this.titleCanvas.height);
                backgroundGradient.addColorStop(0, 'black');
                backgroundGradient.addColorStop(0.5, 'darkgrey');
                backgroundGradient.addColorStop(0.93, 'black');
                backgroundGradient.addColorStop(1, 'black');
                this.titleRender.fillStyle = backgroundGradient;
                // this.titleRender.fillStyle = 'grey';
                this.titleRender.fillRect(0, 0, this.titleCanvas.width, this.titleCanvas.height);
                // 	context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
                // this.titleRender.fillStyle = 'black';
                this.titleRender.drawImage(this.titleImageClean, 0, 0, this.titleCanvas.width, this.titleCanvas.height);
            }
            this.titleRender.restore();

            //draw flashlight layer
            //TODO flashlight size based on canvas size instead of static
            let flashlightSize = this.lightCanvas.width / 8;
            this.lightRender.save();
            this.lightRender.globalCompositeOperation = 'source-over';
            this.lightRender.beginPath();
            this.lightRender.clearRect(0, 0, this.lightCanvas.width, this.lightCanvas.height);
            let backgroundGradient = this.lightRender.createLinearGradient(0, 0, 0, this.titleCanvas.height);
            backgroundGradient.addColorStop(0, 'black');
            backgroundGradient.addColorStop(0.5, 'darkgrey');
            backgroundGradient.addColorStop(0.93, 'black');
            backgroundGradient.addColorStop(1, 'black');
            this.lightRender.fillStyle = backgroundGradient;
            this.lightRender.fillRect(0, 0, this.lightCanvas.width, this.lightCanvas.height);
            if (this.imageReady) {
                this.lightRender.drawImage(this.titleImage, 0, 0, this.lightCanvas.width, this.lightCanvas.height);
            }
            if (this.mouseX != null && this.mouseY != null) {
                this.lightRender.globalCompositeOperation = 'xor';
                let grd = this.lightRender.createRadialGradient(this.mouseX, this.mouseY, 0, this.mouseX, this.mouseY, flashlightSize);
                grd.addColorStop(0, 'rgba(0,0,0,1)');
                grd.addColorStop(0.7, 'rgba(0,0,0,1)');
                grd.addColorStop(0.9, 'rgba(0,0,0,0.8)');
                grd.addColorStop(1, 'rgba(0,0,0,0.1)');

                // Fill with gradient
                this.lightRender.fillStyle = grd;
                // this.lightRender.fillRect(this.mouseX, this.mouseY, 50, 50);
                this.lightRender.arc(this.mouseX, this.mouseY, flashlightSize, 0, 2 * Math.PI);
                this.lightRender.fill();

                //white light effect
                this.lightRender.globalCompositeOperation = 'source-over';
                grd = this.lightRender.createRadialGradient(this.mouseX, this.mouseY, 0, this.mouseX, this.mouseY, flashlightSize);
                grd.addColorStop(0, 'rgba(255,255,255,0.3)');
                // grd.addColorStop(0.7, 'rgba(0,0,0,1)');
                // grd.addColorStop(0.9, 'rgba(0,0,0,1)');
                grd.addColorStop(1, 'rgba(255,255,255,0)');

                // Fill with gradient
                this.lightRender.fillStyle = grd;
                // this.lightRender.fillRect(this.mouseX, this.mouseY, 50, 50);
                this.lightRender.arc(this.mouseX, this.mouseY, 200, 0, 2 * Math.PI);
                this.lightRender.fill();
            }
            this.lightRender.restore();
            window.requestAnimFrame(this.draw);
        }, //draw
        windowResized() {
            this.screenWidth = window.innerWidth;
            this.screenHeight = window.innerHeight;
            this.titleCanvas.width = this.screenWidth * 0.9;
            this.titleCanvas.height = this.titleCanvas.width / 4;
            this.lightCanvas.width = this.screenWidth * 0.9;
            this.lightCanvas.height = this.lightCanvas.width / 4;
            document.getElementById('stage').setAttribute('style', `height:${this.lightCanvas.height + 20}px;`);
        },
        getMousePos(canvas, event) {
            let rect = canvas.getBoundingClientRect();
            return {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            };
        },
        mouseMoved(event) {
            let mousePos = this.getMousePos(this.lightCanvas, event);
            this.mouseX = mousePos.x;
            this.mouseY = mousePos.y;
        }
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

        // this.stage = this.$refs['stage'];
        this.titleCanvas = this.$refs['titleCanvas'];
        this.titleRender = this.titleCanvas.getContext('2d');
        this.lightCanvas = this.$refs['light-layer'];
        this.lightRender = this.lightCanvas.getContext('2d');
        window.addEventListener('resize', this.windowResized);
        this.windowResized();

        this.titleImage.onload = () => {
            this.imageReady = true;
        };
        this.titleImage.src = require('@assets/banner-w.png');

        this.titleImageClean.onload = () => {
            this.cleanimageReady = true;
        };
        this.titleImageClean.src = require('@assets/banner-clean w.png');

        window.addEventListener('mousemove', this.mouseMoved);

        //disabled right-click menu
        window.addEventListener('contextmenu', (event) => event.preventDefault());
        this.setup();
        this.draw();
    } //mounted
};
</script>

<style scoped>
/* #titleMain {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    background: darkgray;
    background: linear-gradient(
        0deg,
        rgba(0, 0, 0, 1) 0%,
        rgba(0, 0, 0, 1) 5%,
        rgba(50, 50, 50, 1) 20%,
        rgba(60, 60, 60, 1) 65%,
        rgba(50, 50, 50, 1) 85%,
        rgba(0, 0, 0, 1) 100%
    );
} */

.item {
    font-size: 20px;
    margin-bottom: 18px;
}

.box-card {
    position: relative;
    width: 30%;
    background-color: black !important;
    box-shadow: 0 2px 12px 0 rgb(255, 255, 255) !important;
    margin: 0 auto;
}

canvas {
    position: absolute;
    top: 0;
    left: 0;
    /* cursor: none; */
}

.stage {
    position: relative !important;
    /* height: 20vh; */
    /* width: 512px;
    height: 512px; */

    /* width: 90%; */
    /* height:100%; */
    /*border: 1px solid white;*/
    margin: 0 5%;
}
#titleCanvas {
    z-index: 1;
}
#lightLayer {
    z-index: 2;
}
</style>
