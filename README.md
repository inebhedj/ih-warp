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

## Releasing (maintainer cheatsheet)

Publishing is done by the GitHub Action [`publish.yml`](.github/workflows/publish.yml) via npm trusted publishing (OIDC). No npm token or 2FA code is needed.

```sh
# 1. Bump the version (commits + creates the vX.Y.Z tag), then push both
npm version patch        # or: minor / major
git push --follow-tags

# 2. Publish a GitHub Release for that tag -> triggers the npm publish
gh release create vX.Y.Z --generate-notes
```

Without the GitHub CLI (`gh`), do step 2 on the website instead: repository page → **Releases** → **Draft a new release** → choose the `vX.Y.Z` tag → (optionally **Generate release notes**) → **Publish release**. The result is the same; follow the run under the **Actions** tab.

- The release tag must exactly match the `package.json` version (with a `v` prefix), otherwise the workflow fails.
- The workflow runs `npm ci`, ESLint, the tag/version check, then `npm publish --access public --provenance`.
- One-time setup on npmjs.com → package **Settings**:
  - **Trusted Publisher** → GitHub Actions: owner `inebhedj`, repository `ih-warp`, workflow filename `publish.yml`.
    - Environment name: leave empty (the workflow uses no `environment:`).
    - Allowed actions: check **allow npm publish** (the workflow publishes directly); leave **allow npm dist-tag** unchecked.
  - **Publishing access** → *Require two-factor authentication and disallow bypass 2fa tokens*.
  - The Trusted Publisher shows *Pending validation* until the first successful publish through the workflow; do that before the deadline shown on the page.
- A version can't be published twice: always bump before releasing.
- Manual fallback (interactive login + 2FA): `npm run publish:npm`.

## License

MPL 2.0
