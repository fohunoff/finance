'use strict';
 
var gulp = require('gulp');
var plumber = require('gulp-plumber'); // чтобы gulp не крашился при ошибках и продолжал работу

var rename = require('gulp-rename');

var server = require('browser-sync').create();

var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer'); // это плагин для postcss

/* Опимизации и минификации */
var cssminify = require('gulp-csso');
var imagemin = require('gulp-imagemin');

/* Сборка и минификация css из scss */
gulp.task('style', function () {
  return gulp.src('src/sass/style.scss')
    .pipe(plumber()) 
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest('build/css/'))
    .pipe(cssminify())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css'))
    .pipe(server.stream());
});

/* Работа с изображениями */
gulp.task('images', function () {
  return gulp.src('src/img/**/*.{png,jpg, svg}')
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest('build/img'));
});

/* Запуск сервера и отслеживание изменений */
gulp.task('serve', gulp.series(['style'], function () {
  server.init({
    server: 'build/'
  });

  gulp.watch('src/sass/**/*.scss', gulp.series(['style']));
  gulp.watch('build/*.html')
    .on('change', server.reload);
}));