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
        short_name: 'GraveNight',
        themeColor: '#000000',
        msTileColor: '#000000',
        display: 'fullscreen',
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
            favicon32: 'src/assets/GNHandLogo512.png',
            favicon16: 'src/assets/GNHandLogo512.png',
            appleTouchIcon: 'src/assets/GNHandLogo512.png',
            maskIcon: 'src/assets/GNHandLogoSVGTransparent2.svg',
            msTileImage: 'src/assets/GNHandLogo512.png'
        }
    }
};
