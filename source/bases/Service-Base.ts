///<reference path="../../typings/es6-promise/es6-promise.d.ts"/>

const _ = require('lodash');
const async = require('async');

export default class ServiceBase {
  services: any;

  constructor() {

  }

  deferred() {
    const d = {
      promise: null,
      resolve: null,
      reject: null
    };

    d.promise = new Promise((resolve, reject) => {
      d.resolve = resolve;
      d.reject = reject;
    });

    return d;
  }

  makeQ (options: any, conn: any, files: any, method: any) {
      /* If file object passed into any of read/write functions, 
      add it to array to push through Q (for backwards compatibility). */
      let singleFile;
      if (!Array.isArray(files)) {
          singleFile = true;
          files = [ files ];
      }
      
      const deferred = this.deferred();
      const errors = [];
      const successes = [];
      /* Concurrency defines how many files are read/written at one time in Q. */
      const concurrencyLimit = 20;
      const concurrency = options.concurrency &&
              options.concurrency < concurrencyLimit ?
              options.concurrency : concurrencyLimit;

      const q = async.queue((file, callback) => {
          /* Perform method passed into makeQ (e.g. readFile, writeFile) */
          return method(file)
              .then((response) => {
                  callback(null, response);
              })
              .catch((err) => {
                  callback(err, file);
              })
      }, concurrency);

      q.drain = () => {
          conn.end();
          /* If any file encountered errors, the error is pushed into the error array,
          and if any errors present at end of Q, reject promise with error(s). */
          if (errors.length) {
              deferred.reject({ errors, successes });
          }
          if (singleFile && successes.length === 1) deferred.resolve(successes[0]);
          deferred.resolve(successes);
      }

      _.each(files, (file) => {
          q.push(file, (err, f) => {
              if (err) {
                  errors.push({
                      error: err,
                      file: f.path
                  });
              } else {
                  successes.push(f);
              }
          });
      });

      return deferred.promise;
  }
}
