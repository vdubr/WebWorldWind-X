const path = require('path');

module.exports = {
    entry: {
        main: './src/index.js',
        Base64ImageExample: ['babel-polyfill', './examples/Base64ImageExample.js'],
        ControlsExample: ['babel-polyfill', './examples/ControlsExample.js'],
        CyclicPickExample: ['babel-polyfill', './examples/CyclicPickExample.js'],
        KmlGroundOverlayExample: ['babel-polyfill', './examples/KmlGroundOverlayExample.js'],
        ModelExample: ['babel-polyfill', './examples/ModelExample.js'],
        LayerOrderExample: ['babel-polyfill', './examples/LayerOrderExample.js'],
        OrbitsExample: ['babel-polyfill', './examples/OrbitsExample.js'],
        ScihubProductsExample: ['babel-polyfill', './examples/ScihubProductsExample.js'],
        SwathExample: ['babel-polyfill', './examples/SwathExample.js'],
        TexturedSurfacePolygonExample: ['babel-polyfill', './examples/TexturedSurfacePolygonExample.js'],
        AcquisitionPlansExample: ['babel-polyfill', './examples/AcquisitionPlansExample.js'],
    },
    devtool: 'source-map',
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, './dist/examples'),
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        rules: [
            {test: /\.css$/, use: ['style-loader','css-loader']},

            {
                test: /\.worker\.js$/,
                use: { 
                    loader: 'worker-loader',
                    options: {
                        publicPath: '/examples/../',
                    },
                },
            },

            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ["@babel/preset-env"]
                    }
                }
            }
        ]
    }
};