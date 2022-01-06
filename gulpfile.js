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
      css: "./assets/css",
    },
  }
}


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
    log(colorBlue, `Copying USWDS theme files to ${settings.paths.dist.sass}`);
    return src(`${settings.paths.src.theme}/*/**`).pipe(dest(settings.paths.dist.sass));
  },
  copyFonts() {
    log(colorBlue, `Copying USWDS fonts to ${settings.paths.dist.fonts}`);
    return src(`${settings.paths.src.fonts}/*/**`).pipe(dest(settings.paths.dist.fonts));
  },
  copyImages() {
    log(colorBlue, `Copying USWDS images to ${settings.paths.dist.img}`);
    return src(`${settings.paths.src.img}/*/**`).pipe(dest(settings.paths.dist.img));
  },
  copyJS() {
    log(colorBlue, `Copying USWDS JS to ${settings.paths.dist.js}`);
    return src(`${settings.paths.src.js}/*/**`).pipe(dest(settings.paths.dist.js));
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
  const settings = {
    plugins: [
      autoprefixer({
        cascade: false,
        grid: true,
      }),
      csso({ forceMediaMerge: false }),
    ],
    includes: [
      settings.paths.dist.sass,
      settings.paths.src.sass,
      `${settings.paths.src.sass}/packages`
    ],
  };

  return (
    src([`${settings.paths.dist.sass}/*.scss`])
      .pipe(sourcemaps.init({ largeFile: true }))
      .pipe(
        sass.sync({ includePaths: settings.includes })
          .on("error", handleError)
      )
      .pipe(replace(/\buswds @version\b/g, `based on uswds v${pkg}`))
      .pipe(postcss(settings.plugins))
      .pipe(sourcemaps.write("."))
      // uncomment the next line if necessary for Jekyll to build properly
      //.pipe(dest(SITE_CSS_DEST))
      .pipe(dest(settings.paths.dist.css))
  );
}

function watchSass() {
  return watch(`${settings.paths.dist.sass}/**/*.scss`, buildSass);
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

  return src(`${settings.paths.dist.img}/usa-icons/**/*.svg`, {
    allowEmpty: true,
  })
    .pipe(svgSprite(config))
    .on("error", handleError)
    .pipe(dest(`${settings.paths.dist.img}`));
}

function renameSprite() {
  return src(`${settings.paths.dist.img}/symbol/svg/sprite.symbol.svg`, {
    allowEmpty: true,
  })
    .pipe(rename(`${settings.paths.dist.img}/sprite.svg`))
    .pipe(dest(`./`));
}

function cleanSprite() {
  return del(`${settings.paths.dist.img}/symbol`);
}

exports.paths = settings.paths.dist;
exports.watch = series(buildSass, watchSass);
exports.copySetup = usaTasks.copySetup;
exports.copyFonts = usaTasks.copyFonts;
exports.copyImages = usaTasks.copyImages;
exports.copyJS = usaTasks.copyJS;
exports.copyAll = parallel(
  this.copySetup,
  this.copyFonts,
  this.copyImages,
  this.copyJS
);
exports.compileSass = buildSass;
exports.compileIcons = series(buildSprite, renameSprite, cleanSprite);
exports.compile = parallel(
  buildSass,
  this.compileIcons
);
exports.init = series(this.copyAll, this.compile);
exports.default = this.init;
