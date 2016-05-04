///<reference path="../../typings/es6-promise/es6-promise.d.ts"/>

import services from '../services/service-config';
const fs = require('fs');

export default class ServiceBase {
  services: any;

  constructor() {
    this.services = services;
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

  readFile(file, options = {}) {
    const deferred = this.deferred();
    const thisFile = typeof file === 'object' ? file.file : file;
    fs.readFile(`${__dirname}/${thisFile}`, options["encoding"] || 'utf8', (err, data) => {
      if (err) {
        return deferred.reject(err);
      }

      deferred.resolve(data);
    });

    return deferred.promise;
  }
}
