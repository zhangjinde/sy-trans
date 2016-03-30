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
      mocha        = require('gulp-mocha'),
      util         = require('gulp-util'),
      argv         = require('yargs').argv,
      exit         = require('gulp-exit'),
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
    }
  );
});

gulp.task('dev-test', () => {
  return runSequence(
    'build-clean',
    'tsd',
    'compile',
    'test',
    'watch-ts',
    'start-test' 
  )
});

gulp.task('start-test', () => {
  const devConfig = require('./dev-config.json');
  return nodemon({
    script: `./${APP}/app.js`,
    env: devConfig,
    tasks: ['test']
  });
});

gulp.task('test', function () {
  var folder = (argv.folder === undefined) ? '**' : argv.folder;
  return gulp.src(['app/' + '**/*.js'])
    .on('end', function () {
      gulp.src('test/' + folder + '/*.js')
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


gulp.task('compile-test', () => {
  return runSequence(
    'build-clean',
    'tsd',
    'compile',
    'test'
  )
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