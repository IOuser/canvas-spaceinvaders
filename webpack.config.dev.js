var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer  = require('autoprefixer');

// console.log(JSON.stringify(JSON.parse(process.env.NODE_ENV === 'development' || 'false')));

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/dev-server',
    './src/js/main'
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "js/[name].js",
    publicPath: '../'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(JSON.parse(process.env.NODE_ENV === 'development' || 'false'))
    })
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
        loaders: [
          "style",
          "css?sourceMap",
          "postcss-loader?sourceMap",
          "resolve-url",
          "sass?sourceMap"
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg|ico)$/i,
        include: path.resolve(__dirname, "src"),
        exclude: path.resolve(__dirname, "src/icons"),
        loaders: [
          'url-loader?limit=16384&name=img/[name].[ext]'
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