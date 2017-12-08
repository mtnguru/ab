var gulp = require('gulp');
//var livereload = require('livereload')
var uglify = require('gulp-uglifyjs');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var notify = require('gulp-notify');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var sassGlob = require('gulp-sass-glob');

gulp.task('imagemin', function () {
    return gulp.src('images/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('images'));
});


gulp.task('sass', function () {
  gulp.src('sass/**/*.scss')
    .pipe(sassGlob())
    .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('css'));
});


//script paths
var jsFiles = 'js/src/**/*.js',
    jsDest = 'js/min';

gulp.task('scripts', function() {
    return gulp.src(jsFiles)
//      .pipe(gulp.dest(jsDest))
//      .pipe(rename('scripts.min.js'))
        .pipe(uglify())
        .pipe(concat('scripts.min.js'))
        .pipe(gulp.dest(jsDest));
});


gulp.task('uglify', function() {
  gulp.src('js/src/**/*.js')
    .pipe(uglify('main.js'))
    .pipe(gulp.dest('js'))
});

/**
 * This task minifies javascript in the js/js-src folder and places them in the js directory.
 */
gulp.task('compress', function() {
  return gulp.src('./js/src/*.js')
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./js/min'))
    .pipe(notify({
      title: "JS Minified",
      message: "All JS files in the theme have been minified.",
      onLast: true
    }));
});


gulp.task('watch', function(){
//  livereload.listen();

    gulp.watch('sass/**/*.scss', ['sass']);

    gulp.watch(['js/src/**/*.js'], ['scripts', 'compress']);

//  gulp.watch(['css/styles.css', '**/*.twig', 'js/*.js'], function (files){
//      livereload.changed(files)
//  });
});
