const gulp = require('gulp');
const path = require('path');
const googleWebfonts = require('gulp-google-webfonts');
const replace = require('gulp-replace');

// Define paths
const paths = {
  js: {
    src: [
      'node_modules/jquery/dist/jquery.min.js',
      'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
      'node_modules/@fluent/web/fluent-web.js',
    ],
    dest: 'src/js'
  },
  css: {
    src: [
      'node_modules/bootstrap/dist/css/bootstrap.min.css'
    ],
    dest: 'src/css'
  },
  icons: {
    src: 'node_modules/bootstrap-icons/font/fonts/*',
    dest: 'src/fonts/bootstrap-icons/fonts'
  },
  iconsCss: {
    src: 'node_modules/bootstrap-icons/font/bootstrap-icons.css',
    dest: 'src/fonts/bootstrap-icons'
  },
  fonts: {
    list: 'fonts.list',
    dest: 'src/fonts',
    cssDest: 'src/css',
    cssFilename: 'google-fonts.css'
  }
};

// Copy JavaScript files
function copyJs() {
  return gulp.src(paths.js.src)
    .pipe(gulp.dest(paths.js.dest));
}

// Copy CSS files
function copyCss() {
  return gulp.src(paths.css.src)
    .pipe(gulp.dest(paths.css.dest));
}

// Copy Bootstrap Icons
function copyIcons() {
  return gulp.src(paths.icons.src, {encoding: false})
    .pipe(gulp.dest(paths.icons.dest));
}

// Copy Bootstrap Icons CSS
function copyIconsCss() {
  return gulp.src(paths.iconsCss.src)
    .pipe(replace('../fonts/', './fonts/'))
    .pipe(gulp.dest(paths.iconsCss.dest));
}

// Download and copy Google Fonts
function copyFonts() {
  return gulp.src(paths.fonts.list)
    .pipe(googleWebfonts({
      fontsDir: 'src/fonts/',
      cssDir: 'src/css/',
      cssFilename: paths.fonts.cssFilename
    }))
    .pipe(gulp.dest('.'));
}

// Update paths in Google Fonts CSS
function updateFontPaths() {
  return gulp.src(`${paths.fonts.cssDest}/${paths.fonts.cssFilename}`)
    .pipe(replace('src/fonts/', '/fonts/'))
    .pipe(gulp.dest(paths.fonts.cssDest));
}

// Define complex tasks
const build = gulp.series(
  gulp.parallel(copyJs, copyCss, copyIcons, copyIconsCss, copyFonts),
  updateFontPaths
);

// Export tasks
exports.copyJs = copyJs;
exports.copyCss = copyCss;
exports.copyIcons = copyIcons;
exports.copyIconsCss = copyIconsCss;
exports.copyFonts = copyFonts;
exports.updateFontPaths = updateFontPaths;
exports.build = build;
exports.default = build;
