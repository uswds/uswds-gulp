# USWDS Compile

Simple [Gulp 4.0](https://gulpjs.com/) functions for copying USWDS static assets and transforming USWDS Sass into browser-readable CSS.

## Requirements

- [Node.js](https://nodejs.org/en/download/)
- [npm](https://www.npmjs.com/get-npm)
- [uswds](https://www.npmjs.com/package/uswds)

## Installation

Install `compile` in the project root:

```bash
npm install @uswds/compile --save
```

## Usage

### Overview
1. Create a `gulpfile.js` file in the project root that includes the following:
    -  Import of the `@uswds/compile` package
    -  Any project path settings you wish to modify (see [Path settings](#path-settings), below)
    -  Exports for the functions/tasks you need (see [Functions](#functions), below)
1. In the terminal run `npx gulp [function]`

### Gulpfile setup
Create a file called `gulpfile.js` at the root of your project (or use an existing Gulpfile if one already exists). It needs to do the following

- Import the `@uswds/compile` package
- Set any project settings
- Export the functions/tasks you need

Here's an example of how your `gulpfile.js` might look:

```js
/* gulpfile.js */

const uswds = require("@uswds/compile");

/** 
 * Path settings
 * Set as many as you need
 */ 

uswds.paths.dist.css = './assets/css/';
uswds.paths.dist.sass = './sass/';

/** 
 * Exports
 * Add as many as you need
 */ 

exports.init = uswds.init;
exports.compile = uswds.compile;
```

### Path settings
Use path settings to customize where USWDS Compile looks for USWDS source and outputs processed files.

Setting | Default | Description
--- | --- | ---
`paths.src.uswds` | `"./node_modules/uswds/dist"` | Source location of the `uswds` package
`paths.src.sass` | `"./node_modules/uswds/dist/scss"` | Source location of the USWDS Sass 
`paths.src.theme` | `"./node_modules/uswds/dist/scss/theme"` | Source location of the USWDS theme files (Sass entry point and starter settings files)
`paths.src.fonts` | `"./node_modules/uswds/dist/fonts"` | Source location of the USWDS fonts
`paths.src.img` | `"./node_modules/uswds/dist/img"` | Source location of the USWDS images
`paths.src.js` | `"./node_modules/uswds/dist/js"` | Source location of the USWDS compiled JavaScript files
`paths.src.projectSass` | `"./sass"` | Source location of any exisiting project Sass files outside of `paths.dist.sass`. The `watch` script will watch this directory for changes.
`paths.dist.sass` | `"./sass"` | Project destination for theme files (Sass entry point and settings)
`paths.dist.img` | `"./assets/uswds/images"` | Project destination for images
`paths.dist.fonts` | `"./assets/uswds/fonts"` | Project destination for fonts
`paths.dist.js` | `"./assets/uswds/js"` | Project destination for compiled JavaScript
`paths.dist.css` | `"./assets/uswds/css"` | Project destination for compiled CSS

### Functions
Export USWDS Compile functions in your project's `gulpfile.js` to use them in your project.

Function | Description
--- | ---
`compile` | `compileSass` + `compileIcons`
`compileIcons` | Build the USWDS icon sprite into `paths.dist.img`
`compileSass` | Compile Sass into `paths.dist.css`
`default` | `watch`
`copyAll` | `copySetup` + `copyAssets`
`copyAssets` | Copies all static assets: `copyFonts` + `copyImages` + `copyJS`  
`copyFonts` | Copy USWDS fonts to `paths.dist.fonts`
`copyImages` | Copy USWDS images to `paths.dist.img`
`copyJS` | Copy USWDS compiled JavaScript to `paths.dist.js`
`copySetup` | Copy USWDS theme files (Sass entry point and settings files) from the `uswds` package to `paths.dist.sass`
`init` | `copyAll` + `compile`
`updateUswds` | `copyAssets` + `compile`
`watch` | Compiles, then recompiles when there are changes to Sass files in `paths.dist.sass` and `paths.src.projectSass`


## Running the compile functions
For any function you defined as an `export` in your `gulpfile.js` you can run `npx gulp [function]`

For example, if you have the following `gulpfile.js`:

```
/* gulpfile,js */

...

exports.compile = uswds.compile;
exports.watch = uswds.watch;
exports.init = uswds.init;
exports.update = uswds.updateUswds;
exports.default = uswds.watch;
```

With that setup, you could do the following in the terminal:

- **Compile Sass:** `npx gulp compile` or `npx gulp`
- **Watch for changes and recompile:** `npx gulp watch`
- **Initialize a new project:** `npx gulp init`
- **Update USWDS statci assets and recompile:** `npx gulp update`

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
