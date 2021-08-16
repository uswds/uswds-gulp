const uswds_path = "node_modules/uswds/dist";

module.exports = {
  src: {
    sass: `${uswds_path}/scss/theme/**/**`,
    fonts: `${uswds_path}/fonts/**/**`,
    img: `${uswds_path}/img/**/**`,
    js: `${uswds_path}/js/**/**`,
  },
  /**
   * ? project paths
   * - all paths are relative to the project root
   * - don't use a trailing `/` for path
   */
  dist: {
    sass: "./sass",
    img: "./images",
    fonts: "./fonts",
    js: "./js",
    css: "./css",
  },
}
