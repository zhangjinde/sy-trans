"use strict";
///<reference path="../../typings/node/node.d.ts"/>
///<reference path="Controller-Options.ts"/>
///<reference path="Router-Options.ts"/>
///<reference path="Endpoint-Params.ts"/>

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var service_config_1 = require('../services/service-config');
var _ = require('lodash');
var express = require('express');

var ControllerBase = function () {
    function ControllerBase(routerOptions) {
        _classCallCheck(this, ControllerBase);

        this.router = express.Router({
            mergeParams: true
        });
        this.urlParams = routerOptions.urlParams;
        this.queryParams = routerOptions.queryParams;
        this.bodyParams = routerOptions.bodyParams;
        if (!routerOptions || !routerOptions.middleware) {
            return;
        }
        _.each(routerOptions.middleware, this.router.use.bind(this));
    }

    _createClass(ControllerBase, [{
        key: 'getArgs',
        value: function getArgs(params, routerParams, reqData) {
            if (!params && !routerParams || !reqData) {
                return {};
            }
            params = _.union(params, routerParams);
            return _.zipObject(params, _.map(params, function (param) {
                if (!reqData[param]) {
                    return;
                }
                return reqData[param];
            }));
        }
    }, {
        key: 'retrieveApiCache',
        value: function retrieveApiCache(cacheKey, cacheDuration, bustCache) {
            bustCache = typeof bustCache === 'string' ? bustCache === 'true' : bustCache;
            if (bustCache || !cacheDuration || !cacheKey || !service_config_1.default.redis) {
                return Promise.resolve();
            }
            return service_config_1.default.redis.get(cacheKey).then(function (cacheResult) {
                try {
                    cacheResult = JSON.parse(cacheResult);
                } catch (ex) {
                    console.error("cache error: ", ex);
                }
                return Promise.resolve(cacheResult);
            });
        }
    }, {
        key: 'saveApiCache',
        value: function saveApiCache(cacheKey, cacheDuration, response, statusCode) {
            var thisCache = JSON.stringify({
                statusCode: statusCode,
                body: response
            });
            return service_config_1.default.redis.set(cacheKey, thisCache).then(function (saveOk) {
                service_config_1.default.redis.expire(cacheKey, cacheDuration);
                return Promise.resolve({
                    saveOk: saveOk,
                    response: response
                });
            });
        }
    }, {
        key: 'createPath',
        value: function createPath(params) {
            var me = this,
                cache = params.cache || {};
            function returnCallback(req, res) {
                var origin = req.headers.origin,
                    callback = params.callback,
                    bodyParams = me.getArgs(params.bodyParams, params.bodyParams, req.body),
                    queryParams = me.getArgs(params.queryParams, me.queryParams, req.query),
                    urlParams = me.getArgs(params.urlParams, me.urlParams, req.params);
                var finalParams = _.assign({}, queryParams, urlParams, bodyParams, req.permissions);
                finalParams.env = finalParams.env || _.includes(origin, "-release") ? "manage-release" : _.includes(origin, "-sites") ? origin.split("-")[0] + "-partner" : "manage";
                var cacheKey = _.map(cache.keys, function (key, index) {
                    return finalParams[key];
                }).join("-");
                me.retrieveApiCache(cacheKey, cache.duration, req.query.bustCache).then(function (cacheResult) {
                    if (!req.query.bustCache && !_.isEmpty(cacheResult) && cacheResult.statusCode) {
                        return res.status(cacheResult.statusCode).send(cacheResult.body);
                    }
                    params.callback(finalParams).then(function (response) {
                        if (!params.cache) {
                            res.send(response);
                            return;
                        }
                        return me.saveApiCache(cacheKey, cache.duration, response, res.statusCode);
                    }).then(function (cacheOk) {
                        res.send(cacheOk.response);
                    }, function (reject) {
                        res.status(500).send(reject);
                    });
                }, function (fail) {
                    console.error(fail);
                });
            }
            if (params.middleware) {
                var _me$router;

                return (_me$router = me.router)[params.type].apply(_me$router, [params.path].concat(_toConsumableArray(params.middleware), [returnCallback]));
            }
            return me.router[params.type](params.path, returnCallback);
        }
    }]);

    return ControllerBase;
}();

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ControllerBase;