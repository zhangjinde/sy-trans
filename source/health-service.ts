///<reference path="../typings/node/node.d.ts"/>
///<reference path="../typings/es6-promise/es6-promise.d.ts"/>
///<reference path="./bases/Router-Options.ts"/>

import ServiceBase from './bases/Service-Base';

export default class HealthService extends ServiceBase {
  logger: any;
  vitals: any;

  constructor() {
    super();
    this.logger = this.services.logger;
    this.vitals = this.services.vitals;
  }

  getReport() {
    return Promise.resolve(this.vitals.getReport());
  }
}