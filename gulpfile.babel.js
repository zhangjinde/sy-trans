'use strict';

const addsrc       = require('gulp-add-src'),
      gulp         = require('gulp'),
      ts           = require('gulp-typescript'),
      nodemon      = require('gulp-nodemon'),
      tsd          = require('gulp-tsd'),
      runSequence  = require('run-sequence'),
      tslint       = require('gulp-tslint'),
      del          = require('del'),
      zip          = require('gulp-zip'),
      //awsBeanstalk = require('node-aws-beanstalk'),
      tsConfig     = require('./tsconfig.json'),
      //beanstalkCnf = require("./beanstalk-config.js"),
      APP          = 'app',
      DEPLOY       = 'deploy';

gulp.task('dev', () => {
  return runSequence(
    'build-clean',
    'tsd',
    'compile',
    'watch-ts', () => {

    const devConfig = require('./dev-config.json');
    return nodemon({
      script: `./${APP}/app.js`,
      env: devConfig
    });
  });
});

gulp.task('build-clean', function () {
    return del([
      `./${APP}`
    ],{
        force: true
    });
});

gulp.task('deploy', () => { 
  return runSequence(
    'build-clean',
    'tsd',
    'compile',
    'zip',
    'upload'); 
});

gulp.task('zip', () => {
  return gulp.src([
    'node_modules/**/*'
  ], {
      base: "."
    })
    .pipe(addsrc(`./${APP}/**/*`))
    .pipe(zip('app.zip'))
    .pipe(gulp.dest(DEPLOY));
});


gulp.task('upload', () => {
  console.log(beanstalkCnf);
  awsBeanstalk.deploy(`${DEPLOY}/app.zip`, beanstalkCnf, (result) => {
    console.log(result);
  });
});

gulp.task('copy-config', () => {
  return gulp.src([
    './source/**/*.json'
  ])
    .pipe(gulp.dest(APP));
});

gulp.task('watch-ts', () => {
  return gulp.watch([
    './source/**/*.ts',
    '!gulpfile.babel.js'
  ], ['compile']);
});

gulp.task('compile', ['copy-config'], () => {
  return gulp.src([
    './source/**/*.ts', 
    '!./node_modules/**',
  ])
    .pipe(tslint())
    .pipe(tslint.report('verbose'))
    .pipe(ts(tsConfig.compilerOptions))
    .pipe(gulp.dest(APP));
});

gulp.task('tsd', () => {
  return gulp.src('gulp_tsd.json').pipe(tsd({
      command: 'reinstall',
      latest: false,
      config: './tsd.json',
  }));
});