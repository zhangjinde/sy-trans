///<reference path="../../typings/es6-promise/es6-promise.d.ts"/>

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
}
