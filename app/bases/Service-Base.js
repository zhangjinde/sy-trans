///<reference path="../../typings/es6-promise/es6-promise.d.ts"/>
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var service_config_1 = require('../services/service-config');
var fs = require('fs');

var ServiceBase = function () {
    function ServiceBase() {
        _classCallCheck(this, ServiceBase);

        this.services = service_config_1.default;
    }

    _createClass(ServiceBase, [{
        key: 'deferred',
        value: function deferred() {
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
        }
    }, {
        key: 'readFile',
        value: function readFile(file) {
            var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            var deferred = this.deferred();
            var thisFile = (typeof file === 'undefined' ? 'undefined' : _typeof(file)) === 'object' ? file.file : file;
            fs.readFile(__dirname + '/' + thisFile, options["encoding"] || 'utf8', function (err, data) {
                if (err) {
                    return deferred.reject(err);
                }
                deferred.resolve(data);
            });
            return deferred.promise;
        }
    }]);

    return ServiceBase;
}();

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ServiceBase;