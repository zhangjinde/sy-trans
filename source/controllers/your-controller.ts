///<reference path='../bases/Router-Options.ts'/>
///<reference path="../../typings/es6-promise/es6-promise.d.ts"/>
import ControllerBase from '../bases/Controller-Base';
import YourService from '../services/your-service';
const yourService = new YourService();
const managePermissions = require('symphony-api').managePermissions;
const verifyHttps = require('symphony-api').verifyHttps;

export default class YourController extends ControllerBase {
  routerPath: string;
  routerOptions: RouterOptions;

  constructor() {
    super({
      urlParams: ["site"]
    });

    this.routerPath = '/:site';
  }

  register() {
    this.createPath({
      type: "get",
      path: '/',
      apiCache: {
        duration: 6000,
        keys: ["site"]
      },
      middleware: [],
      urlParams: [],
      queryParams: [],
      bodyParams: [],
      callback: function() {
        return Promise.resolve('hello world');
      }
    });

    this.createPath({
      type: "put",
      path: '/:site/tags/',
      middleware: [managePermissions],
      urlParams: ['site'],
      queryParams: [],
      bodyParams: [],
      callback: yourService.doThings.bind(yourService)
    });

    return this.router;
  }
}