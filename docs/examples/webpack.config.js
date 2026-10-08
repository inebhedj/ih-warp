const ihWARP = require('@inebhedj/ih-warp');
/* other codes */

module.exports = {
  /* webpack configuration settings... */
  plugins: [
    /* other plugins... */
    new ihWARP({
      assetPaths: ['./src/assets'],
      exceptHTML: ['ignore-this.html'],
      exceptAssets: ['ignore-this.png'],
      mapExtensions: ['.css', '.js'],
      verbose: true
    })
    /* other plugins... */
  ]
  /* other configuration settings... */
};
