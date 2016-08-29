'use strict';

let webpack = require('webpack')
let webpackDevServer = require('webpack-dev-server');
let config = require('./webpack.config.dev')

new webpackDevServer(webpack(config), {
  contentBase: './',
  compress: true,
  hot: true,
  inline: true
}).listen(3000);