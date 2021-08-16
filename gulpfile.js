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
const pkg = require("./node_modules/uswds/package.json");
const postcss = require("gulp-postcss");
const replace = require("gulp-replace");
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps");
const del = require("del");
const svgSprite = require("gulp-svg-sprite");
const rename = require("gulp-rename");
const log = console.log;
const colorBlue = "\x1b[34m%s\x1b[0m";
const paths = require("./config/uswds-paths");

const uswds = "./node_modules/uswds/uswds";

/*
----------------------------------------
PATHS
Configure in `uswds-paths.js`
----------------------------------------

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
    return src(paths.src.sass).pipe(dest(paths.dist.sass));
  },
  copyFonts() {
    log(colorBlue, "Copying USWDS fonts");
    return src(paths.src.fonts).pipe(dest(paths.dist.fonts));
  },
  copyImages() {
    log(colorBlue, "Copying USWDS images");
    return src(paths.src.img).pipe(dest(paths.dist.img));
  },
  copyJS() {
    log(colorBlue, "Copying USWDS JS");
    return src(paths.src.js).pipe(dest(paths.dist.js));
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
    INCLUDES: [paths.dist.sass, `${uswds}/dist/scss`, `${uswds}/dist/scss/packages`],
  };

  return (
    src([`${paths.dist.sass}/*.scss`])
      .pipe(sourcemaps.init({ largeFile: true }))
      .pipe(
        sass.sync({ includePaths: SETTINGS.INCLUDES })
          .on("error", handleError)
      )
      .pipe(replace(/\buswds @version\b/g, `based on uswds v${uswds.version}`))
      .pipe(postcss(SETTINGS.PLUGINS))
      .pipe(sourcemaps.write("."))
      // uncomment the next line if necessary for Jekyll to build properly
      //.pipe(dest(SITE_CSS_DEST))
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
