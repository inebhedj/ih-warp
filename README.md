# @inebhedj/ih-warp

IH Webpack Assets Replicator Plugin (ihWARP)

A webpack plugin that copies assets referenced in HTML files into the output directory.

## Description

Webpack plugin for copying assets referenced in HTML files. This plugin scans through Webpack's output assets for HTML files,
extracts asset references (from src, href, meta tags, etc.), and copies the referenced asset files from specified directories (assetPaths) into the Webpack output directory. Files can be excluded from processing via exceptHTML (for HTML files) and exceptAssets (for asset paths). Additionally, if the asset file's extension is listed in mapExtensions, a corresponding .map file will also be copied.

## Requirements

- Node.js LTS (version >=20.17.0 <21 || >=22 <23 || >=24 <25 || >=26 <27)  
- Corresponding npm version 
- Webpack >= 5 (maybe works with webpack 4)

## Installation

```sh
npm install --save-dev @inebhedj/ih-warp
```

## Example usage in webpack.config.js

```javascript
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
```

### Options

- `assetPaths`: Array of directory/directories where the asset files are searched.
- `exceptHTML`: Array of HTML file paths (relative) to be excluded.
- `exceptAssets`: Array of asset paths to be omitted from processing.
- `mapExtensions`: Array of file extensions for which associated .map files are copied. (default: ['.css', '.js'])
- `verbose`: Enables vlogging output.

## License

MPL 2.0
