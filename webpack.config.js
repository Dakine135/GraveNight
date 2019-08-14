const path = require('path');

module.exports = {
    mode: 'development', //production
    entry: './clientSource/index.js',
    devtool: 'inline-source-map',
    optimization: {
        minimize: true
    },
    output: {
        filename: 'clientBundle.js',
        path: path.resolve(__dirname, './public/js')
    },
    performance: {
	    hints: false, // enum  "warning"
	    maxAssetSize: 2000000, // int (in bytes),
	    maxEntrypointSize: 4000000, // int (in bytes)
	    // assetFilter: function(assetFilename) {
	    //   // Function predicate that provides asset filenames
	    //   return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
    	// }
  	},
    module: {
        rules: [
          {
            test: /\.worker\.js$/,
            use: {
                loader: 'worker-loader',
                options: { inline: true, name: 'workers.js'}
            }
          } 
        ]
    } 
}