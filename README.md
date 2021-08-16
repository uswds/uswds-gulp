# USWDS Gulp pipeline for copying assets and compiling Sass

A simple [Gulp 4.0](https://gulpjs.com/) workflow for transforming USWDS Sass into browser-readable CSS.

**Note:** You do _not_ need to clone this repo into your project. Follow the instructions below.

## Requirements

You'll need to be familiar with the command line.

You'll need [node](https://nodejs.org/en/download/) and [npm](https://www.npmjs.com/get-npm).

## Installation

If you've never installed Gulp, you'll need to install the Gulp command line interface:

```bash
npm install gulp-cli -g
```

Install USWDS, if you haven't already, with the following command in your project's root directory:

```bash
npm install uswds@latest
```

Finally install uswds-gulp in the project root:

```bash
npm install -S uswds-gulp
```

## Usage

USWDS Gulp offers the following tasks:

**Scaffolding tasks**
- `copySetup` Copy USWDS SCSS theme files.
- `copyFonts` Copy USWDS fonts.
- `copyImages` Copy USWDS images.
- `copyJS` Copy USWDS JavaScript.
- `copyAll` Copy all USWDS assets.
- `init`
  - `copyAll`
  - `buildSass`
- `default`
  - `init`

**Build tasks**
- `buildSass` Compile SCSS.
- `buildSvgSprite` Create a SVG sprite based on icons inside usa-icons.

**Watch tasks**
- `watch` Watch for SCSS changes.

---

**If you don't already have a project gulpfile,** copy the `gulpfile.js` to your current directory (the project root):

```bash
cp node_modules/uswds-gulp/gulpfile.js .
```

---

**If you do already have a project gulpfile,** you can pick and choose the tasks you need:

```js
const uswdsTasks = require("uswds-gulp");

exports.copyAll = uswdsTasks.copyAll;
exports.buildSass = uswdsTasks.buildSass;
exports.buildSvgSprite = uswdsTasks.buildSvgSprite;
```

You can customize your paths like so:

```js
const uswdsTasks = require("uswds-gulp");

// Where I want to place compiled SCSS
uswdsTasks.paths.css = './my-project-dist/css/'

// Other paths available:
//  sass: "./sass",
//  img: "./images",
//  fonts: "./fonts",
//  js: "./js",
//  css: "./css",

exports.buildSass = uswdsTasks.buildSass;
```

---

**If you only need basic setup and compilation (scaffolding, SCSS, icons)**

If you just quickly want to compile SCSS or build an SVG Spritesheet you can run the tasks immediately after installing USWDS-Gulp.

**View default tasks**

```bash
npx gulp --tasks-simple --gulpfile ./node_modules/uswds-gulp/gulpfile.js
```

**Running default tasks**

```bash
npx gulp buildSass --gulpfile ./node_modules/uswds-gulp/gulpfile.js --cwd .
```

---

### Autoprefixer
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

### Initialize your USWDS project

Initialization does the following:

- Copies settings files and the USWDS base Sass file to your project Sass directory
- Copies images, fonts, and javascript files to the directories you set above
- Compiles the USWDS Sass into a usable CSS file, called `styles.css` by default

Intitialize your USWDS project by running the following command:

```bash
npx gulp init
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
gulp buildSvgSprite
```

:rocket:
