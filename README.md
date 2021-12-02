# USWDS Gulp pipeline for copying assets and compiling Sass

A simple [Gulp 4.0](https://gulpjs.com/) workflow for transforming USWDS Sass into browser-readable CSS.

**Note:** You do _not_ need to clone this repo into your project. Follow the instructions below.

## Requirements

You'll need to be familiar with the command line.

You'll need [node](https://nodejs.org/en/download/) and [npm](https://www.npmjs.com/get-npm).

You'll need to install the following packages via `npm`:

- autoprefixer
- del
- gulp@^4.0.2
- gulp-replace
- sass
- gulp-sass
- gulp-sourcemaps
- postcss
- gulp-postcss
- gulp-rename
- gulp-svg-sprite
- postcss-csso
- uswds@latest
- uswds-gulp@github:uswds/uswds-gulp

## Installation

If you've never installed Gulp, you'll need to install the Gulp command line interface:

```bash
npm install gulp-cli -g
```

Ensure your project has a `package.json` file. You can create one by following the instructions on the [USWDS fundamentals and quickstart guide](https://designsystem.digital.gov/documentation/fundamentals/).

Add all the required dependencies at once with following command from your project's root directory:

```bash
npm install autoprefixer del gulp gulp-replace sass gulp-sass gulp-sourcemaps gulp-rename gulp-svg-sprite gulp-postcss postcss postcss-csso uswds uswds-gulp@github:uswds/uswds-gulp --save-dev
```

## Usage

**If you don't already have a project gulpfile,** copy the `gulpfile.js` to your current directory (the project root):

```bash
cp node_modules/uswds-gulp/gulpfile.js .
```

OR

**If you do already have a project gulpfile,** copy and rename the USWDS gulpfile (then you can manually add the contents of the USWDS gulpfile to your existing gulpfile and continue with the instructions):

```bash
cp node_modules/uswds-gulp/gulpfile.js gulpfile-uswds.js
```

We use autoprefixer for maximum browser compatibility. To ensure you're targeting the correct browsers we use a `.browserslistrc` file. **If you don't already have one** copy our file to your current directory (the project root):

```bash
cp node_modules/uswds-gulp/.browserslistrc .
```

OR

If you already have a `.browserslistrc` make sure you're targeting the following browsers:

```bash
> 2%
last 2 versions
IE 11
not dead
```

---

Open `gulpfile.js` in a text editor. In the `Paths` section, set the following constants with the proper paths. Don't use trailing slashes in the paths. All paths should be relative to the project root.

- `PROJECT_SASS_SRC`: The directory where we'll save your USWDS settings files and the project's custom Sass.
- `IMG_DEST`: The directory where we'll save the USWDS images
- `FONTS_DEST`: The directory where we'll save the USWDS fonts
- `JS_DEST`: The directory where we'll save the USWDS javascript
- `CSS_DEST`: The destination of the final, compiled CSS

---

Save `gulpfile.js` with these updated paths.

---

Initialize your USWDS project. Initialization does the following:

- Copies settings files and the USWDS base Sass file to your project Sass directory
- Copies images, fonts, and javascript files to the directories you set above
- Compiles the USWDS Sass into a usable CSS file, called `styles.css` by default

Intitialize your USWDS project by running the following command:

```bash
gulp init
```

---

Edit your USWDS settings in the new settings files and add custom Sass to the new `_uswds-theme-custom-styles.scss` file. Watch these files and compile any changes with

```bash
gulp watch
```

---

### Update SVG sprite

After running `gulp init`, the USWDS images will be moved into your project. Open the USWDS `images` directory and find the `usa-icons` and `usa-icons-unused` directories. Either add your own SVGs to the `usa-icons` directory or move icons from `usa-icons-unused` into `usa-icons` and rebuild the sprite with

```bash
gulp svg-sprite
```

:rocket:
