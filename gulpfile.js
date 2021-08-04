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
const gulp = require("gulp");
const pkg = require("./node_modules/uswds/package.json");
const postcss = require("gulp-postcss");
const replace = require("gulp-replace");
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps");
const uswds = require("./node_modules/uswds-gulp/config/uswds");
const del = require("del");
const svgSprite = require("gulp-svg-sprite");
const rename = require("gulp-rename");
const log = console.log;
const colorBlue = "\x1b[34m%s\x1b[0m";

/*
----------------------------------------
PATHS
----------------------------------------
*/
const PATHS = {
  SRC: {
    SASS: `${uswds}/scss/theme/**/**`,
    FONTS: `${uswds}/fonts/**/**`,
    IMG: `${uswds}/img/**/**`,
    JS: `${uswds}/js/**/**`,
  },
  /**
   * ? Project paths
   * - All paths are relative to the project root
   * - Don't use a trailing `/` for path
   */
  DIST: {
    SASS: "./sass",
    IMG: "./images",
    FONTS: "./fonts",
    JS: "./js",
    CSS: "./css",
  },
};

// Site CSS destination
// Like the _site/assets/css directory in Jekyll, if necessary.
// If using, uncomment line 106
// const SITE_CSS_DEST = "./path/to/site/css/destination";

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
const usaTasks = {
  copySetup() {
    log(colorBlue, "Copying USWDS theme files");
    return src(PATHS.SRC.SASS).pipe(dest(PATHS.DIST.SASS));
  },
  copyFonts() {
    log(colorBlue, "Copying USWDS fonts");
    return src(PATHS.SRC.FONTS).pipe(dest(PATHS.DIST.FONTS));
  },
  copyImages() {
    log(colorBlue, "Copying USWDS images");
    return src(PATHS.SRC.IMG).pipe(dest(PATHS.DIST.IMG));
  },
  copyJS() {
    log(colorBlue, "Copying USWDS JS");
    return src(PATHS.SRC.JS).pipe(dest(PATHS.DIST.JS));
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
  const SETTINGS = {
    PLUGINS: [
      autoprefixer({
        cascade: false,
        grid: true,
      }),
      csso({ forceMediaMerge: false }),
    ],
    INCLUDES: [PATHS.DIST.SASS, `${uswds}/scss`, `${uswds}/scss/packages`],
  };

  return (
    src([`${PATHS.DIST.SASS}/*.scss`])
      .pipe(sourcemaps.init({ largeFile: true }))
      .pipe(
        sass.sync({ includePaths: SETTINGS.INCLUDES })
          .on("error", handleError)
      )
      .pipe(replace(/\buswds @version\b/g, `based on uswds v${pkg.version}`))
      .pipe(postcss(SETTINGS.PLUGINS))
      .pipe(sourcemaps.write("."))
      // uncomment the next line if necessary for Jekyll to build properly
      //.pipe(dest(SITE_CSS_DEST))
      .pipe(dest(PATHS.DIST.CSS))
  );
}

function watchSass() {
  return watch(`${PATHS.DIST.SASS}/**/*.scss`, buildSass);
};

function buildSprite() {
  const config = {
    shape: {
      dimension: {
        // Set maximum dimensions
        maxWidth: 24,
        maxHeight: 24,
      },
      id: {
        separator: "-",
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

  return src(`${PATHS.DIST.IMG}/usa-icons/**/*.svg`, {
    allowEmpty: true,
  })
    .pipe(svgSprite(config))
    .on("error", .on("error", handleError))
    .pipe(dest(`${PATHS.DIST.IMG}`));
}

function renameSprite() {
  return src(`${PATHS.DIST.IMG}/symbol/svg/sprite.symbol.svg`, {
    allowEmpty: true,
  })
    .pipe(rename(`${PATHS.DIST.IMG}/sprite.svg`))
    .pipe(dest(`./`));
}

function cleanSprite() {
  return del(`${PATHS.DIST.IMG}/symbol`);
}


exports.watch = series(buildSass, watchSass);
exports.buildSass = buildSass;
exports.copySetup = usaTasks.copySetup;
exports.copyFonts = usaTasks.copyFonts;
exports.copyImages = usaTasks.copyImages;
exports.copyJS = usaTasks.copyImages;
exports.copyAll = parallel(
  this.copySetup,
  this.copyFonts,
  this.copyImages,
  this.copyJS
);
exports.svgSprite = series(buildSprite, renameSprite, cleanSprite);
exports.init = series(this.copyAll, buildSass);
exports.default = parallel(this.watch);
