///<reference path='../bases/Router-Options.ts'/>
///<reference path="../../typings/es6-promise/es6-promise.d.ts"/>
import ControllerBase from '../bases/Controller-Base';
import HealthService from '../health-service';

const healthService = new HealthService(),
      verifyHttps = require('node-symphony').verifyHttps;

export default class YourController extends ControllerBase {
  routerPath: string;
  routerOptions: RouterOptions;
  getReport: any;

  constructor() {
    super({});

    this.routerPath = '';
    this.getReport = healthService.getReport.bind(healthService);
  }

  register() {
    this.createPath({
      type: "get",
      path: '/health',
      middleware: [],
      urlParams: [],
      queryParams: [],
      bodyParams: [],
      callback: this.getReport
    });

    return this.router;
  }
}