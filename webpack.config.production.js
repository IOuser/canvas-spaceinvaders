var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer  = require('autoprefixer');


module.exports = {
  devtool: 'source-map',
  entry: {
    main: './src/js/main'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "js/[name].js",
    publicPath: '../'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true
      },
      comments: false
    }),
    // new webpack.optimize.CommonsChunkPlugin("common", "js/common.js"),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      __DEV__: false,
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new ExtractTextPlugin('css/[name].css', {})
  ],
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loaders: ['eslint'],
        include: [
          path.resolve(__dirname, "src"),
        ],
      }
    ],
    loaders: [
      {
        loaders: ['babel-loader'],
        include: [
          path.resolve(__dirname, "src"),
        ],
        test: /\.js$/,
        plugins: ['transform-runtime'],
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract("css?sourceMap!postcss-loader?sourceMap!resolve-url!sass?sourceMap")
      },
      {
        test: /\.(jpe?g|png|gif|svg|ico)$/i,
        include: path.resolve(__dirname, "src"),
        exclude: path.resolve(__dirname, "src/icons"),
        loaders: [
          'url-loader?limit=16384&name=img/[name].[ext]',
          'image-webpack?progressive=true&optimizationLevel=7&interlaced=true'
        ]
      }

    ]
  },
  postcss: function() {
    return [
      autoprefixer({ browsers: ['last 2 versions'] })
    ]
  }
}