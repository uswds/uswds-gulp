const uswds_path = "node_modules/uswds/dist";

module.exports = {
  SRC: {
    SASS: `${uswds_path}/scss/theme/**/**`,
    FONTS: `${uswds_path}/fonts/**/**`,
    IMG: `${uswds_path}/img/**/**`,
    JS: `${uswds_path}/js/**/**`,
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
}
