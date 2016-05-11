///<reference path='../bases/Router-Options.ts'/>
///<reference path="../../typings/es6-promise/es6-promise.d.ts"/>
import ControllerBase from '../bases/Controller-Base';
import YourService from '../services/your-service';

const yourService = new YourService(),
      managePermissions = require('node-symphony').managePermissions,
      verifyHttps = require('node-symphony').verifyHttps;

export default class YourController extends ControllerBase {
  routerPath: string;
  routerOptions: RouterOptions;
  doThings: any;

  constructor() {
    super({
      urlParams: ["site"]
    });

    this.routerPath = '/:site';
    this.doThings = yourService.doThings.bind(yourService)
  }

  register() {
    this.createPath({
      type: "get",
      path: '/things',
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
      path: '/cached',
      cache: {
        duration: 6000,
        keys: ["site"]
      },
      urlParams: ['site'],
      queryParams: [],
      bodyParams: [],
      callback: function() {
        return Promise.resolve('hello world - cached');
      }
    })

    this.createPath({
      type: "put",
      path: '/doThings',
      middleware: [managePermissions],
      urlParams: ['site'],
      queryParams: [],
      bodyParams: ['jobs'],
      callback: this.doThings
    });

    return this.router;
  }
}