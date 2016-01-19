///<reference path="../../typings/node/node.d.ts"/>
///<reference path="../../typings/es6-promise/es6-promise.d.ts"/>
///<reference path="../bases/Router-Options.ts"/>
///<reference path="../interfaces/Address.ts"/>
///<reference path="../interfaces/Parcel.ts"/>
///<reference path="../interfaces/Label-Request.ts"/>
const _ = require('lodash');
const async = require('async');
import ServiceBase from '../bases/Service-Base';

export default class YourService extends ServiceBase {
  easypost: any;
  logger: any;

  constructor() {
    super();
    this.easypost = this.services.easypost;
    this.logger = this.services.logger;
  }

  private doSomethingPrivate(someData: any) {
    return new Promise((resolve, reject) => {
      somethingPrivate.init({ 
        someData: someData
      }, (err, label) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(label);
      });
    });
  }

  doThings(body: any) {
    const me = this;
    const queueResults = [];
    const someQueue = async.queue((thisData, next) => {
      if (me.doSomethingPrivate(thisData)) {
        queueResults.push(results);
        next();
      }
    });

    someQueue.push(body.jobs);
    return new Promise((resolve, reject) => {
        someQueue.drain = (err) => {
        if (err) {
          me.logger.error("Error Job", err);
        }

        resolve(queueResults);
      }
    });
  }
}