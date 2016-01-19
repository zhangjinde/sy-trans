///<reference path="../../typings/node/node.d.ts"/>
///<reference path="../../typings/es6-promise/es6-promise.d.ts"/>
///<reference path="../bases/Router-Options.ts"/>

const _ = require('lodash');
const async = require('async');
import ServiceBase from '../bases/Service-Base';

export default class YourService extends ServiceBase {
  easypost: any;
  logger: any;

  constructor() {
    super();
    this.logger = this.services.logger;
  }

  private doSomethingPrivate(someData: any) {
    return new Promise((resolve, reject) => {
      (() => {
          if (someData) {
              resolve("resolved");
          } else {
              reject("rejected!!");
          }
      })();
    });
  }

  doThings(body: any) {
    const me = this;
    const queueResults = [];
    const someQueue = async.queue((thisData, next) => {
      me.doSomethingPrivate(thisData).then((result) => {
        queueResults.push(result);
        next();
      }).catch((ex) => {
        queueResults.push({
          error: ex
        });
      });
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