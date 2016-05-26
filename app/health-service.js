///<reference path="../../typings/node/node.d.ts"/>
///<reference path="../../typings/es6-promise/es6-promise.d.ts"/>
///<reference path="../bases/Router-Options.ts"/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Service_Base_1 = require('../bases/Service-Base');
var HealthService = (function (_super) {
    __extends(HealthService, _super);
    function HealthService() {
        _super.call(this);
        this.logger = this.services.logger;
        this.vitals = this.services.vitals;
    }
    HealthService.prototype.getReport = function () {
        return Promise.resolve(this.vitals.getReport());
    };
    return HealthService;
}(Service_Base_1["default"]));
exports.__esModule = true;
exports["default"] = HealthService;
