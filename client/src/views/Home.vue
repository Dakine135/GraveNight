<template>
    <div class="home">
        <!-- <div id="header">
            <svg height="500" width="500">
                <image
                    xlink:href="../assets/GNHandLogoSVG.svg"
                    src="GNHandLogo512.png"
                    alt="Gravenight Hand Logo SVG"
                    title="GraveNight Hand Logo"
                    width="500"
                    height="500"
                />
            </svg>
        </div> -->
        <!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->

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
    </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";

export default {
    name: 'Home',
    components: {
        // HelloWorld,
    }
};
</script>

<style>
#header {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
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

    /* background: linear-gradient(0deg, rgba(0, 0, 0, 1) 0%, rgba(85, 85, 85, 1) 45%, rgba(85, 85, 85, 1) 55%, rgba(0, 0, 0, 1) 100%); */
}

.item {
    font-size: 20px;
    margin-bottom: 18px;
}

.box-card {
    width: 30%;
    background-color: black !important;
    box-shadow: 0 2px 12px 0 rgb(255, 255, 255) !important;
    margin: 0 auto;
}
</style>
