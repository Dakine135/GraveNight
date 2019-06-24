const path = require('path');

module.exports = {
    mode: 'development',
    entry: './clientSource/index.js',
    devtool: 'inline-source-map',
    output: {
        filename: 'clientBundle.js',
        path: path.resolve(__dirname, './public/js')
    }
}