///<reference path="../../typings/es6-promise/es6-promise.d.ts"/>
"use strict";
var ServiceBase = (function () {
    function ServiceBase() {
    }
    ServiceBase.prototype.deferred = function () {
        var d = {
            promise: null,
            resolve: null,
            reject: null
        };
        d.promise = new Promise(function (resolve, reject) {
            d.resolve = resolve;
            d.reject = reject;
        });
        return d;
    };
    return ServiceBase;
}());
exports.__esModule = true;
exports["default"] = ServiceBase;
