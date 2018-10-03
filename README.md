# USWDS Gulp pipeline for compiling Sass
A simple [Gulp 4.0](https://gulpjs.com/)-based workflow for transpiling USWDS Sass into usable CSS.

## Requirements
You'll need to be familiar with the command line.

You'll need [node](https://nodejs.org/en/download/) and [npm](https://www.npmjs.com/get-npm). The installation instructions are linked here.

You'll need to install the following packages via `npm`:
- autoprefixer
- css-mqpacker
- cssnano
- gulp@^4.0.0
- gulp-notify
- gulp-postcss
- gulp-rename
- gulp-replace
- gulp-sass
- gulp-sourcemaps
- path
- uswds@^2.0.0-beta
- uswds-gulp@github:uswds/uswds-gulp

## Installation
If you've never installed Gulp, you'll need to install the gulp command line interface:

```
npm install gulp-cli -g
```

Add all the required dependencies at once with following command from your project's root directory:

```
npm install autoprefixer css-mqpacker cssnano gulp@^4.0.0 gulp-notify gulp-postcss gulp-rename gulp-replace gulp-sass gulp-sourcemaps path uswds@^2.0.0-beta uswds-gulp@github:uswds/uswds-gulp --save-dev
```

## Usage
1. If you don't already have a project gulpfile, copy the `gulpfile.js` to your current directory (the project root):

```
cp node_modules/uswds-gulp/gulpfile.js .
```

2. If you do already have a project gulpfile, copy and rename the USWDS gulpfile (then you can manually add the contents of the USWDS gulpfile to your existing gulpfile):

```
cp node_modules/uswds-gulp/gulpfile.js gulpfile-uswds.js
```

3. Open the gulpfile in a text editor and set the following constants in the `Locations` section with the proper paths. Don't use trailing slashes in the paths. All paths should be relative to the project root.

  - `PROJECT_SASS_SRC`: The directory where we'll save your USWDS settings files and the project's custom Sass.
  - `IMG_DEST`: The directory where we'll save the USWDS images
  - `FONTS_DEST`: The directory where we'll save the USWDS fonts
  - `JS_DEST`: The directory where we'll save the USWDS javascript
  - `CSS_DEST`: The destination of the final, transpiled CSS


4. Save the gulpfile with your updated settings.

5. initialize your USWDS project. Initialization does the following:

  - Copies settings files and the USWDS base Sass file to your project Sass directory
  - Copies images, fonts, and javascript files to the directories you set above
  - Transpiles the USWDS Sass into a usable CSS file, called `styles.css` by default


Intitialize your USWDS project by running the following command:

```
gulp init
```

6. Edit your USWDS settings in the new settings files and add custom Sass to the new `_uswds-theme-custom-styles.scss` file. Watch these files and compile any changes with

```
gulp watch
```
