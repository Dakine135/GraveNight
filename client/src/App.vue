<template>
    <div id="app">
        <div id="nav">
            <router-link to="/">Home</router-link> | <router-link to="/changelog">Changelog</router-link> |
            <router-link to="/Game">Game</router-link>
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
    color: #2c3e50;
}

#nav {
    padding: 30px;
}

#nav a {
    font-weight: bold;
    color: #2c3e50;
}

#nav a.router-link-exact-active {
    color: #42b983;
}
</style>
