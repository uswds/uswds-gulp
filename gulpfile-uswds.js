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

var autoprefixer  = require('autoprefixer');
var cssnano       = require('cssnano');
var gulp          = require('gulp');
var mqpacker      = require('css-mqpacker');
var notify        = require('gulp-notify');
var path          = require('path');
var pkg           = require('./node_modules/uswds/package.json');
var postcss       = require('gulp-postcss');
var rename        = require('gulp-rename');
var replace       = require('gulp-replace');
var sass          = require('gulp-sass');
var sourcemaps    = require('gulp-sourcemaps');

/*
----------------------------------------
LOCATIONS
----------------------------------------
- All locations are relative to the
  project root
- Don't use a trailing `/` for path
  names
----------------------------------------
*/

// USWDS source directory
const USWDS_SRC = 'node_modules/uswds/dist';

// Project Sass source directory
const PROJECT_SASS_SRC = './path/to/project/sass';

// Images destination
const IMG_DEST = './path/to/images/destination';

// Fonts destination
const FONTS_DEST = './path/to/fonts/destination';

// Javascript destination
const JS_DEST = './path/to/js/destination';

// Compiled CSS destination
const CSS_DEST = './path/to/css/destination';

/*
----------------------------------------
SETTINGS
----------------------------------------
*/

const AUTOPREFIXER_OPTIONS = [
  '> 1%',
  'Last 2 versions',
  'IE 11',
];

/*
----------------------------------------
TASKS
----------------------------------------
*/

gulp.task('copy-gulpfile', () => {
  return gulp.src('gulpfile.js')
  .pipe(rename('gulpfile-uswds.js'))
  .pipe(gulp.dest('.'));
});

gulp.task('copy-uswds-setup', () => {
  return gulp.src(`${USWDS_SRC}/scss/theme/**/**`)
  .pipe(gulp.dest(`${PROJECT_SASS_SRC}`));
});

gulp.task('copy-uswds-fonts', () => {
  return gulp.src(`${USWDS_SRC}/fonts/**/**`)
  .pipe(gulp.dest(`${FONTS_DEST}`));
});

gulp.task('copy-uswds-images', () => {
  return gulp.src(`${USWDS_SRC}/js/**/**`)
  .pipe(gulp.dest(`${IMG_DEST}`));
});

gulp.task('copy-uswds-js', () => {
  return gulp.src(`${USWDS_SRC}/img/**/**`)
  .pipe(gulp.dest(`${JS_DEST}`));
});

gulp.task('build-sass', function (done) {
  var plugins = [
    // Autoprefix
    autoprefixer(AUTOPREFIXER_OPTIONS),
    // Pack media queries
    mqpacker({ sort: true }),
    // Minify
    cssnano(({ autoprefixer: { browsers: AUTOPREFIXER_OPTIONS }}))
  ];
  return gulp.src([
      `${PROJECT_SASS_SRC}/*.scss`
    ])
    .pipe(replace(
      /\buswds @version\b/g,
      'uswds v' + pkg.version
    ))
    .pipe(sourcemaps.init({ largeFile: true }))
    .pipe(sass({
        includePaths: [
          `${PROJECT_SASS_SRC}`,
          `${USWDS_SRC}/scss`,
          `${USWDS_SRC}/scss/packages`,
        ]
      }))
    .pipe(postcss(plugins))
    .pipe(gulp.dest(`${CSS_DEST}`))
    .pipe(sourcemaps.write('.'))
    .pipe(notify({
      "sound": "Pop" // case sensitive
    }));
});

gulp.task('init', gulp.series(
  'copy-uswds-setup',
  'copy-uswds-fonts',
  'copy-uswds-images',
  'copy-uswds-js',
  'build-sass',
));

gulp.task('watch-sass', function () {
  gulp.watch(`${PROJECT_SASS_SRC}/**/*.scss`, gulp.series('build-sass'));
});

gulp.task('watch', gulp.series('build-sass', 'watch-sass'));

gulp.task('default', gulp.series('watch'));
