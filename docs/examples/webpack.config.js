const path = require('path');
const ihWARP = require('@inebhedj/ih-warp');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  plugins: [
    new ihWARP({
      assetPaths: ['./src/assets'],
      exceptHTML: ['ignore-this.html'],
      exceptAssets: ['ignore-this.png'],
      mapExtensions: ['.css', '.js'],
      verbose: true
    })
  ]
};
