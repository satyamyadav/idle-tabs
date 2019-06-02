const path = require('path');
const Visualizer = require('webpack-visualizer-plugin');

module.exports = {
  context: path.join(__dirname, './src'),
  entry: './index.js',
  output: {
    filename: 'idleTabs.js',
    path: path.resolve(__dirname, './lib'),
    library: 'webpackNumbers',     
    libraryTarget: 'umd'
  },
  mode: 'production',
  plugins: [
    new Visualizer()
  ]
};