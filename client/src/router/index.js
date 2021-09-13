import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Game from '../views/Game.vue';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/changelog',
        name: 'Changelog',
        // route level code-splitting
        // this generates a separate chunk (changelog.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "changelog" */ '../views/Changelog.vue')
    },
    {
        path: '/game',
        name: 'Game',
        component: Game
    }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

export default router;
