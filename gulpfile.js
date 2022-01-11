/*
* * * * * ==============================
* * * * * ==============================
* * * * * ==============================
* * * * * ==============================
========================================
========================================
========================================
----------------------------------------
USWDS SASS GULPFILE
----------------------------------------
*/

const autoprefixer = require("autoprefixer");
const csso = require("postcss-csso");
const { src, dest, series, parallel, watch } = require("gulp");
const pkg = require("../../uswds/package.json").version;
const postcss = require("gulp-postcss");
const replace = require("gulp-replace");
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps");
const del = require("del");
const svgSprite = require("gulp-svg-sprite");
const rename = require("gulp-rename");
const log = console.log;
const colorBlue = "\x1b[34m%s\x1b[0m";

/*
----------------------------------------
SETTINGS
----------------------------------------
*/
let settings = {
  compile: {
    paths: {
      src: {
        uswds: "node_modules/uswds/dist",
        sass: "node_modules/uswds/dist/scss",
        theme: "node_modules/uswds/dist/scss/theme",
        fonts: "node_modules/uswds/dist/fonts",
        img: "node_modules/uswds/dist/img",
        js: "node_modules/uswds/dist/js",
      },
      /**
       * ? project paths
       * - all paths are relative to the project root
       * - don't use a trailing `/` for path
       */
      dist: {
        sass: "./sass",
        img: "./assets/uswds/images",
        fonts: "./assets/uswds/fonts",
        js: "./assets/uswds/js",
        css: "./assets/uswds/css",
      },
    },
    browserslist: [
      "> 2%",
      "last 2 versions",
      "IE 11",
      "not dead"
    ],
  },
  sprite: {
    width: 24,
    height: 24,
    separator: "-",
  }
}

let paths = settings.compile.paths;

/*
----------------------------------------
TASKS
----------------------------------------
*/

/*
----------------------------------------
USWDS specific tasks
----------------------------------------
*/
const copy = {
  theme() {
    log(colorBlue, `Copying USWDS theme files to ${paths.dist.sass}`);
    return src(`${paths.src.theme}/**/**`).pipe(dest(paths.dist.sass));
  },
  fonts() {
    log(colorBlue, `Copying USWDS fonts to ${paths.dist.fonts}`);
    return src(`${paths.src.fonts}/**/**`).pipe(dest(paths.dist.fonts));
  },
  images() {
    log(colorBlue, `Copying USWDS images to ${paths.dist.img}`);
    return src(`${paths.src.img}/**/**`).pipe(dest(paths.dist.img));
  },
  js() {
    log(colorBlue, `Copying USWDS JavaScript to ${paths.dist.js}`);
    return src(`${paths.src.js}/**/**`).pipe(dest(paths.dist.js));
  },
};

/*
----------------------------------------
General tasks
----------------------------------------
*/

function handleError(error) {
  log(error.message);
  return this.emit("end");
}

function buildSass() {

  const buildSettings = {
    plugins: [
      autoprefixer({
        cascade: false,
        grid: true,
        overrideBrowserslist: settings.compile.browserslist
      }),
      csso({ forceMediaMerge: false }),
    ],
    includes: [
      paths.dist.sass,
      paths.src.sass,
      `${paths.src.sass}/packages`
    ],
  };

  return (
    src([`${paths.dist.sass}/*.scss`])
      .pipe(sourcemaps.init({ largeFile: true }))
      .pipe(
        sass.sync({ includePaths: buildSettings.includes })
          .on("error", handleError)
      )
      .pipe(replace(/\buswds @version\b/g, `based on uswds v${pkg}`))
      .pipe(postcss(buildSettings.plugins))
      .pipe(sourcemaps.write("."))
      .pipe(dest(paths.dist.css))
  );
}

function watchSass() {
  return watch(`${paths.dist.sass}/**/*.scss`, buildSass);
};

function buildSprite() {
  const config = {
    shape: {
      dimension: {
        // Set maximum dimensions
        maxWidth: settings.sprite.width,
        maxHeight: settings.sprite.width,
      },
      id: {
        separator: settings.sprite.separator,
      },
      spacing: {
        // Add padding
        padding: 0,
      },
    },
    mode: {
      symbol: true, // Activate the «symbol» mode
    },
  };

  return src(`${paths.dist.img}/usa-icons/**/*.svg`, {
    allowEmpty: true,
  })
    .pipe(svgSprite(config))
    .on("error", handleError)
    .pipe(dest(`${paths.dist.img}`));
}

function renameSprite() {
  return src(`${paths.dist.img}/symbol/svg/sprite.symbol.svg`, {
    allowEmpty: true,
  })
    .pipe(rename(`${paths.dist.img}/sprite.svg`))
    .pipe(dest(`./`));
}

function cleanSprite() {
  return del(`${paths.dist.img}/symbol`);
}

exports.settings = settings;
exports.paths = paths;
exports.copyTheme = copy.theme;
exports.copyFonts = copy.fonts;
exports.copyImages = copy.images;
exports.copyJS = copy.js;
exports.copyAssets = parallel(
  copy.fonts,
  copy.images,
  copy.js
);
exports.copyAll = parallel(
  copy.theme,
  this.copyAssets
);
exports.compileSass = buildSass;
exports.compileIcons = series(buildSprite, renameSprite, cleanSprite);
exports.compile = parallel(
  buildSass,
  this.compileIcons
);
exports.updateUswds = series(
  this.copyAssets,
  this.compile
);

exports.init = series(this.copyAll, this.compile);
exports.watch = series(buildSass, watchSass);
exports.default = this.watch;
