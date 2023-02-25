const { src, dest, watch, parallel, series }  = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const rename = require("gulp-rename");
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const uglify = require('gulp-uglify');
const del = require('del');

function server() {

    browserSync.init({
        server: {
            baseDir: "dist"
        }
    });
};

function clean() {
    return del(['dist/**']);
}

function styles() {
    return src("src/sass/**/*.+(scss|sass)")
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename({suffix: '.min', prefix: ''}))
        .pipe(autoprefixer())
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(dest("dist/css"))
        .pipe(browserSync.stream());
};

function watchAll() {
    watch("src/sass/**/*.+(scss|sass|css)", styles);
    watch("src/*.html", {events: 'change'}, html);
    watch("src/js/**/*.js", {events: 'change'}, scripts);
    watch("src/fonts/**/*", {events: 'all'}, fonts);
    watch("src/icons/**/*", {events: 'all'}, icons);
    watch("src/img/**/*", {events: 'all'}, images);
};

function html() {
    return src("src/*.html")
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(dest("dist/"))
        .pipe(browserSync.stream());
};

function scripts() {
    return src("src/js/**/*.js")
        .pipe(uglify())
        .pipe(dest("dist/js"))
        .pipe(browserSync.stream());
};

function fonts() {
    return src("src/fonts/**/*")
        .pipe(dest("dist/fonts"))
        .pipe(browserSync.stream());
};

function icons() {
    return src("src/icons/**/*")
        .pipe(dest("dist/icons"))
        .pipe(browserSync.stream());
};

function images() {
    return src("src/img/**/*")
        .pipe(imagemin())
        .pipe(dest("dist/img"))
        .pipe(browserSync.stream());
};


exports.build = series(clean, parallel(html, styles, scripts, fonts, icons, images))

exports.default = parallel(server, styles, scripts, fonts, icons, html, images, watchAll)