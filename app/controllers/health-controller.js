"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path='../bases/Router-Options.ts'/>
///<reference path="../../typings/es6-promise/es6-promise.d.ts"/>
var Controller_Base_1 = require('../bases/Controller-Base');
var health_service_1 = require('../health-service');
var healthService = new health_service_1["default"](), verifyHttps = require('node-symphony').verifyHttps;
var YourController = (function (_super) {
    __extends(YourController, _super);
    function YourController() {
        _super.call(this, {});
        this.routerPath = '';
        this.getReport = healthService.getReport.bind(healthService);
    }
    YourController.prototype.register = function () {
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
    };
    return YourController;
}(Controller_Base_1["default"]));
exports.__esModule = true;
exports["default"] = YourController;
