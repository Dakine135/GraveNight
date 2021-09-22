const path = require('path');

module.exports = {
    // ...other vue-cli plugin options...
    configureWebpack: {
        resolve: {
            alias: {
                '@assets': path.resolve(__dirname, 'src/assets/')
            }
        }
    },
    pwa: {
        name: 'GraveNight',
        themeColor: '#4DBA87',
        msTileColor: '#000000',
        appleMobileWebAppCapable: 'yes',
        appleMobileWebAppStatusBarStyle: 'black',

        // configure the workbox plugin
        workboxPluginMode: 'InjectManifest',
        workboxOptions: {
            // swSrc is required in InjectManifest mode.
            swSrc: 'src/registerServiceWorker.js'
            // ...other Workbox options...
        },
        iconPaths: {
            favicon32: null,
            favicon16: null,
            appleTouchIcon: null,
            maskIcon: null,
            msTileImage: null
        }
    }
};
