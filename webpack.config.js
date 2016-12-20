var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'public/app');
var APP_DIR = path.resolve(__dirname, 'src/client');

var config = {
	entry: {
		index: APP_DIR + '/app/index.jsx',
		poller: APP_DIR + '/poller/index.jsx',
	},
	output: {
		path: BUILD_DIR,
		filename: '[name].bundle.js'
	},
	module: {
		loaders: [
			{
				test: /\.jsx?/,
				include: APP_DIR,
				loader: 'babel'
			}
		]
	}
};

module.exports = config;
