// Copyright (c) 2024 inebhedj

/**
 *
 * INEBHEDJ - Webpack Assets Replicator Plugin (ihWARP)
 *
 * @fileoverview
 * ENG: Webpack plugin for copying assets referenced in HTML files.
 *       This plugin scans through Webpack's output assets for HTML files,
 *       extracts asset references (from src, href, meta tags, etc.),
 *       and copies the referenced asset files from specified directories (assetPaths)
 *       into the Webpack output directory. Files can be excluded from processing
 *       via exceptHTML (for HTML files) and exceptAssets (for asset paths). Additionally,
 *       if the asset file's extension is listed in mapExtensions, a corresponding .map file
 *       will also be copied.
 *
 * HUN: Webpack bővítmény a HTML fájlokban hivatkozott eszközök másolására.
 *       A bővítmény végigkeresi a Webpack által generált asseteket, kiszűri a HTML fileokat,
 *       majd az ezekben szereplő asset referenciákat (pl. src, href, meta tag) feldolgozva
 *       átmásolja az eszközöket a megadott assetPaths könyvtárakból a Webpack output mappába.
 *       Az exceptHTML tömbben megadott HTML fájlokat, illetve az exceptAssets tömbben szereplő asset-eket kihagyja.
 *       Amennyiben egy fájl kiterjesztése szerepel a mapExtensions listában, a hozzá tartozó .map fájl is
 *       átmásolásra kerül.
 *
 * @class ihWARP
 * @param {Object} [options={}] - Plugin konfigurációs objektum.
 * @param {string|Array[]} [options.assetPaths] - ENG: Array of directory/directories where the asset files are searched.
 *                                                 HUN: Könyvtárak tömbje, ahol az eszközök kereshetők.
 * @param {string|Array[]} [options.exceptHTML] - ENG: Array of HTML file paths (relative) to be excluded.
 *                                                 HUN: Azoknak a HTML fájloknak az elérési útjaiból álló tömb, melyek kizárásra kerülnek.
 * @param {string|Array[]} [options.exceptAssets] - ENG: Array of asset paths to be omitted from processing.
 *                                                   HUN: A feldolgozásból kihagyandó asset útvonalait tartalmazó tömb.
 * @param {string|Array[]} [options.mapExtensions=['.css', '.js']] - ENG: Array of file extensions for which associated .map files are copied. (default: ['.css', '.js'])
 *                                                                   HUN: Fájlkiterjesztések tömbje, melyekhez a .map fájlokat is átmásolja. (alapértelmezés: ['.css', '.js'])
 * @param {boolean} [options.verbose=true] - ENG: Enables verbose logging output.
 *                                           HUN: Bekapcsolja a részletes logolást.
 *
 * @example
 * // const ihWARP = require('ih-warp');
 * // module.exports = {
 * //   plugins: [
 * //     new ihWARP({
 * //       assetPaths: ['./src/assets'],
 * //       exceptHTML: ['ingnore-this.html'],
 * //       exceptAssets: ['ignore-this.png'],
 * //       mapExtensions: ['.css', '.js'],
 * //       verbose: true
 * //     })
 * //   ]
 * // };
 */

const fs = require('fs');
const path = require('path');

// ANSI escape sequences for colors
const COLOR_GREEN = '\x1b[32m';
const COLOR_RESET = '\x1b[0m';

class ihWARP {
  constructor(options = {}) {
    // Parse assetPaths and mapExtensions options using helper method.
    this.assetPaths = ihWARP._parseOption(options?.assetPaths);
    this.exceptHTML = ihWARP._parseOption(options?.exceptHTML);
    this.exceptAssets = ihWARP._parseOption(options?.exceptAssets);
    this.mapExtensions = ihWARP._parseOption(options?.mapExtensions, [
      '.css',
      '.js'
    ]);
    this.swName = 'ihWARP';
    this.verbose = options?.verbose === false ? false : true;
  }

  /**
   * ENG: Helper function to parse string or array options.
   * HUN: Segédfüggvény az opciók (string vagy tömb) normalizálására.
   */
  static _parseOption(option, defaultValue = []) {
    if (Array.isArray(option)) {
      return option;
    } else if (typeof option === 'string' && option.trim() !== '') {
      return [option.trim()];
    }
    return defaultValue;
  }

  /**
   * ENG: Asynchronously checks if a file exists.
   * HUN: Aszinkron módon ellenőrzi, hogy egy fájl létezik-e.
   */
  async _fileExists(filePath) {
    try {
      await fs.promises.access(filePath, fs.constants.F_OK);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * ENG: Asynchronously retrieves the file size in KiB.
   * HUN: Aszinkron módon lekérdezi a fájl méretét KiB-ben.
   */
  async _getFileSize(filePath) {
    try {
      const stats = await fs.promises.stat(filePath);
      return (stats.size / 1024).toFixed(1);
    } catch {
      return 0;
    }
  }

  /**
   * ENG: Asynchronously copies a file to the destination and logs the operation.
   * HUN: Aszinkron módon átmásolja a fájlt a célhelyre, majd logolja a műveletet.
   */
  async _copyFileProcess(srcPath, destPath) {
    await fs.promises.mkdir(path.dirname(destPath), { recursive: true });
    await fs.promises.copyFile(srcPath, destPath);
    const sizeKiB = await this._getFileSize(srcPath);
    if (this.verbose) {
      console.log(
        `${this.swName} - [OK] copied file: ${COLOR_GREEN}${srcPath}${COLOR_RESET} -> ${COLOR_GREEN}${destPath}${COLOR_RESET} (${sizeKiB} KiB)`
      );
    }
  }

  /**
   * ENG: Asynchronously iterates over the provided search paths to find an existing asset.
   * HUN: Aszinkron módon iterál a keresési utak felett, hogy megtalálja a létező asset-et.
   */
  async _findExistingAssetPath(assetPath, searchPaths) {
    for (const basePath of searchPaths) {
      const potentialPath = path.resolve(basePath, assetPath);
      if (await this._fileExists(potentialPath)) {
        return potentialPath;
      }
    }
    return null;
  }

  apply(compiler) {
    compiler.hooks.emit.tapPromise('ihWARP', async (compilation) => {
      if (this.verbose) {
        console.log(`--------- ${this.swName} ---------`);
        console.log(`${this.swName} - [INFO] FILE COPY PROCESSING STARTED`);
      }

      const htmlFiles = Object.keys(compilation.assets)
        .filter(
          (filename) =>
            filename.endsWith('.html') &&
            !(this.exceptHTML && this.exceptHTML.includes(filename))
        )
        .sort();

      const copyOperations = [];

      for (const htmlFile of htmlFiles) {
        const htmlContent = compilation.assets[htmlFile].source();

        const globalAssetPaths = [
          ...this.assetPaths,
          path.dirname(path.resolve(compiler.context, htmlFile))
        ];

        const regex =
          /(?:src|href)\s*=\s*"([^"]+)"|<meta\s+[^>]*?(?:property|name)\s*=\s*"(?:og:image|twitter:image)"[^>]*?content\s*=\s*"([^"]+)"|content\s*=\s*"([^"]+)"[^>]*?(?:property|name)\s*=\s*"(?:og:image|twitter:image)"[^>]*?>/g;
        const assetPaths = new Set();
        let match;
        while ((match = regex.exec(htmlContent)) !== null) {
          const assetPath = match[1] || match[2] || match[3];
          if (
            assetPath &&
            !assetPath.startsWith('http') &&
            !assetPath.startsWith('//') &&
            path.extname(assetPath) &&
            !(this.exceptAssets && this.exceptAssets.includes(assetPath))
          ) {
            assetPaths.add(assetPath);
          }
        }

        for (const assetPath of Array.from(assetPaths).sort()) {
          const filename = assetPath.startsWith('/')
            ? `.${assetPath}`
            : assetPath;

          const srcPath = await this._findExistingAssetPath(
            filename,
            globalAssetPaths
          );
          const destPath = path.resolve(compiler.outputPath, filename);

          if (srcPath !== null) {
            copyOperations.push(this._copyFileProcess(srcPath, destPath));

            if (this.mapExtensions.some((ext) => filename.endsWith(ext))) {
              const mapFilename = `${filename}.map`;
              const mapSrcPath = await this._findExistingAssetPath(
                mapFilename,
                globalAssetPaths
              );
              const mapDestPath = path.resolve(
                compiler.outputPath,
                mapFilename
              );
              if (mapSrcPath !== null) {
                copyOperations.push(
                  this._copyFileProcess(mapSrcPath, mapDestPath)
                );
              } else if (this.verbose) {
                console.log(
                  `${this.swName} - [INFO] no map file ${COLOR_GREEN}${mapFilename}${COLOR_RESET} found in ${globalAssetPaths.join(', ')}`
                );
              }
            }
          } else if (this.verbose) {
            console.warn(
              `${this.swName} - [WARNING] referenced file ${COLOR_GREEN}${filename}${COLOR_RESET} not found in ${globalAssetPaths.join(', ')}`
            );
          }
        }
      }
      await Promise.all(copyOperations);
      if (this.verbose) {
        console.log(`--------------------------`);
      }
    });
  }
}

module.exports = ihWARP;
