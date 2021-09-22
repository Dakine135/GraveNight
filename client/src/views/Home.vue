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
        <ul>
            <li><a href="https://www.patreon.com/DustinWelborn">Patreon</a></li>
            <li><a href="https://github.com/Dakine135/GraveNight">Github</a></li>
            <li><a href="https://www.reddit.com/r/GraveNight/">Reddit</a></li>
        </ul>
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
</style>
