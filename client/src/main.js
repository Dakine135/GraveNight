import Vue from 'vue';
import App from './App.vue';
// import "./registerServiceWorker";
import router from './router';
import store from './store';

import { getAnalytics, logEvent } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';

// For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
const firebaseConfig = {
    apiKey: 'AIzaSyCgoWqH0N1-VWYVPZkXM7q5JTj3fgAm9nI',
    authDomain: 'gravenight-88a1a.firebaseapp.com',
    projectId: 'gravenight-88a1a',
    storageBucket: 'gravenight-88a1a.appspot.com',
    messagingSenderId: '562000280891',
    appId: '1:562000280891:web:971275900215e7511dcb1e',
    measurementId: 'G-QNJCSQNY8D'
};

const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: (h) => h(App)
}).$mount('#app');
