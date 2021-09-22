<template>
    <div id="app">
        <div class="greyGradient">
            <el-row>
                <el-col :span="6">
                    <svg id="GNsvg" height="100" width="100">
                        <image
                            xlink:href="@assets/GNHandLogoSVG.svg"
                            src="GNHandLogo512.png"
                            alt="Gravenight Hand Logo SVG"
                            title="GraveNight Hand Logo"
                            width="100"
                            height="100"
                        />
                    </svg>
                </el-col>
                <el-col :span="18">
                    <div id="nav">
                        <router-link to="/">Home</router-link> | <router-link to="/changelog">Changelog</router-link> |
                        <router-link to="/Game">Game</router-link>
                    </div>
                </el-col>
            </el-row>
        </div>

        <router-view />
    </div>
</template>
<script>
export default {
    data() {
        return {
            debugMode: false
        };
    },
    components: {},
    computed: {
        layout() {
            return `${this.$route.meta.layout || 'default'}-layout`;
        }
    },
    methods: {},

    watch: {},

    created() {
        //Ctrl + F12 Debug Toggle Listener
        window.addEventListener('keydown', (event) => {
            if (event.ctrlKey && event.key === 'F12') {
                this.debugMode = !this.debugMode;
            }
        });
    },
    mounted() {
        document.title = 'Grave Night';
    }
};
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
}

.greyGradient {
    width: auto;
    height: 150px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: left;
    background: darkgrey;
    background: linear-gradient(
        0deg,
        rgba(0, 0, 0, 1) 0%,
        rgba(0, 0, 0, 1) 5%,
        rgba(50, 50, 50, 1) 20%,
        rgba(60, 60, 60, 1) 65%,
        rgba(50, 50, 50, 1) 85%,
        rgba(0, 0, 0, 1) 100%
    );
}

#GNsvg {
    text-align: left;
    vertical-align: bottom;
    margin: 40px 5px;
}

/* @font-face {
  font-family: myFirstFont;
  src: url(sansation_light.woff);
} */

body {
    color: #00488f;
    background: #000;
}

#nav {
    padding: 30px;
    vertical-align: middle;
}

#nav a {
    font-weight: bold;
    color: #2c3e50;
}

#nav a.router-link-exact-active {
    color: lightGrey;
}
</style>
