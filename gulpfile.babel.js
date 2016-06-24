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

// const addsrc       = require('gulp-add-src'),
//       babel        = require('gulp-babel'),
//       gulp         = require('gulp'),
//       ts           = require('gulp-typescript'),
//       nodemon      = require('gulp-nodemon'),
//       tsd          = require('gulp-tsd'),
//       runSequence  = require('run-sequence'),
//       tslint       = require('gulp-tslint'),
//       del          = require('del'),
//       zip          = require('gulp-zip'),
//       //awsBeanstalk = require('node-aws-beanstalk'),
//       tsConfig     = require('./tsconfig.json'),
//       mocha        = require('gulp-mocha'),
//       util         = require('gulp-util'),
//       argv         = require('yargs').argv,
//       exit         = require('gulp-exit'),
//       //beanstalkCnf = require("./beanstalk-config.js"),
//       APP          = 'app',
//       DEPLOY       = 'deploy';

// gulp.task('dev', () => {
//   return runSequence(
//     'build-clean',
//     'compile',
//     'watch-ts',
//     'nodemon'
//   );
// });

// gulp.task('nodemon', () => {
//   const devConfig = require('./dev-config.json');
//   return nodemon({
//     script: `./${APP}/app.js`,
//     env: devConfig
//   });
// });


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

// gulp.task('deploy', () => { 
//   return runSequence(
//     'build-clean',
//     'compile',
//     'zip',
//     'upload'); 
// });

// gulp.task('zip', () => {
//   return gulp.src([
//     'node_modules/**/*'
//   ], {
//       base: "."
//     })
//     .pipe(addsrc(`./${APP}/**/*`))
//     .pipe(zip('app.zip'))
//     .pipe(gulp.dest(DEPLOY));
// });


// gulp.task('upload', () => {
//   console.log(beanstalkCnf);
//   awsBeanstalk.deploy(`${DEPLOY}/app.zip`, beanstalkCnf, (result) => {
//     console.log(result);
//   });
// });

// gulp.task('copy-config', () => {
//   return gulp.src([
//     './source/**/*.json'
//   ])
//     .pipe(gulp.dest(APP));
// });

// gulp.task('watch-ts', () => {
//   return gulp.watch([
//     './source/**/*.ts',
//     '!gulpfile.babel.js'
//   ], ['compile']);
// });


gulp.task('compile-test', () => {
  return runSequence(
    'build-clean',
    'compile',
    'test'
  )
});

// // gulp.task('compile', ['copy-config'], () => {
// //   return gulp.src([
// //     './typings/**/*.ts',
// //     './source/**/*.ts'
// //   ])
// //     .pipe(tslint())
// //     .pipe(tslint.report('verbose'))
// //     .pipe(ts(tsConfig.compilerOptions))
// //     .pipe(gulp.dest(APP));
// // });

// gulp.task('compile', function(callback) {
//   return runSequence('copy-config',
//     'tsd',
//     'typescript',
//     callback
//   );
// });


// //-------------
// // Typescript
// //-------------
// // Typescript
// gulp.task('typescript', [], function() {
//     return gulp.src([
//         './typings/**/*.ts',
//         './source/**/*.ts',
//     ])
//     .pipe(ts({
//         "target" : "es6",
//         "module": "commonjs",
//         "noImplicitAny": false,
//         "removeComments": false,
//         "preserveConstEnums": true,
//         "outDir": './app',
//         "sourceMap": true
//     }))
//     .pipe(babel({
//         presets: ['es2015']
//     }))
//     .pipe(gulp.dest(APP));
// });

// gulp.task('tsd', () => {
//  return gulp.src('./gulp_tsd.json')
//     .pipe(tsd());
// });

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