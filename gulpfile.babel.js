// 'use strict';

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
const plugins = gulpLoadPlugins();

const mocha        = require('gulp-mocha'),
      util         = require('gulp-util'),
      exit         = require('gulp-exit'),
      del          = require('del'),
      runSequence  = require('run-sequence'),
      APP          = 'app';

gulp.task('test', function () {
  // var folder = (argv.folder === undefined) ? '**' : argv.folder;
  return gulp.src(['app/' + '**/*.js'])
    .on('end', function () {
      gulp.src('test/**/*.js')
        .pipe(mocha({
            reporter: 'spec'
        }))
        .on('error', util.log)
        .pipe(exit());
    });
});

gulp.task('build-clean', () => {
    return del([
      `./${APP}`
    ],{
        force: true
    });
});

gulp.task('compile-test', () => {
  return runSequence(
    'build-clean',
    'compile',
    'test'
  )
});

gulp.task('compile', () => {
  return gulp.src('source/**/*.ts')
             .pipe(plugins.typescript())   
             .pipe(gulp.dest("app"));
});

gulp.task('mocha', ['compile'], () => {
  return gulp.src('mocha_test/*.spec.js')
             .pipe(plugins.mocha());
});

gulp.task('dev', ['mocha'], () => {
  gulp.watch(['source/**', 'mocha_test/*.spec.js'], ['mocha']);
});