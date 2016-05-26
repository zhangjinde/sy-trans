///<reference path="../../typings/es6-promise/es6-promise.d.ts"/>
"use strict";
var service_config_1 = require('../services/service-config');
var fs = require('fs');
var ServiceBase = (function () {
    function ServiceBase() {
        this.services = service_config_1["default"];
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
    ServiceBase.prototype.readFile = function (file, options) {
        if (options === void 0) { options = {}; }
        var deferred = this.deferred();
        var thisFile = typeof file === 'object' ? file.file : file;
        fs.readFile(__dirname + "/" + thisFile, options["encoding"] || 'utf8', function (err, data) {
            if (err) {
                return deferred.reject(err);
            }
            deferred.resolve(data);
        });
        return deferred.promise;
    };
    return ServiceBase;
}());
exports.__esModule = true;
exports["default"] = ServiceBase;
