"use strict";
///<reference path="../../typings/node/node.d.ts"/>
///<reference path="Controller-Options.ts"/>
///<reference path="Router-Options.ts"/>
///<reference path="Endpoint-Params.ts"/>
var service_config_1 = require('../services/service-config');
var _ = require("lodash");
var express = require("express");
var ControllerBase = (function () {
    function ControllerBase(routerOptions) {
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
    ControllerBase.prototype.getArgs = function (params, routerParams, reqData) {
        if ((!params && !routerParams) || !reqData) {
            return {};
        }
        params = _.union(params, routerParams);
        return _.zipObject(params, _.map(params, function (param) {
            if (!reqData[param]) {
                return;
            }
            return reqData[param];
        }));
    };
    ControllerBase.prototype.retrieveApiCache = function (cacheKey, cacheDuration, bustCache) {
        bustCache = typeof bustCache === 'string' ? bustCache === 'true' : bustCache;
        if (bustCache || !cacheDuration || !cacheKey || !service_config_1["default"].redis) {
            return Promise.resolve();
        }
        return service_config_1["default"].redis.get(cacheKey).then(function (cacheResult) {
            try {
                cacheResult = JSON.parse(cacheResult);
            }
            catch (ex) {
                console.error("cache error: ", ex);
            }
            return Promise.resolve(cacheResult);
        });
    };
    ControllerBase.prototype.saveApiCache = function (cacheKey, cacheDuration, response, statusCode) {
        var thisCache = JSON.stringify({
            statusCode: statusCode,
            body: response
        });
        return service_config_1["default"].redis.set(cacheKey, thisCache)
            .then(function (saveOk) {
            service_config_1["default"].redis.expire(cacheKey, cacheDuration);
            return Promise.resolve({
                saveOk: saveOk,
                response: response
            });
        });
    };
    ControllerBase.prototype.createPath = function (params) {
        var me = this, cache = params.cache || {};
        function returnCallback(req, res) {
            var origin = req.headers.origin, callback = params.callback, bodyParams = me.getArgs(params.bodyParams, params.bodyParams, req.body), queryParams = me.getArgs(params.queryParams, me.queryParams, req.query), urlParams = me.getArgs(params.urlParams, me.urlParams, req.params);
            var finalParams = _.assign({}, queryParams, urlParams, bodyParams, req.permissions);
            finalParams.env = finalParams.env ||
                _.includes(origin, "-release") ? "manage-release" :
                _.includes(origin, "-sites") ? origin.split("-")[0] + "-partner" :
                    "manage";
            var cacheKey = _.map(cache.keys, function (key, index) {
                return finalParams[key];
            }).join("-");
            me.retrieveApiCache(cacheKey, cache.duration, req.query.bustCache)
                .then(function (cacheResult) {
                if (!req.query.bustCache && !_.isEmpty(cacheResult) && cacheResult.statusCode) {
                    return res.status(cacheResult.statusCode).send(cacheResult.body);
                }
                params.callback(finalParams).then(function (response) {
                    if (!params.cache) {
                        res.send(response);
                        return;
                    }
                    return me.saveApiCache(cacheKey, cache.duration, response, res.statusCode);
                })
                    .then(function (cacheOk) {
                    res.send(cacheOk.response);
                }, function (reject) {
                    res.status(500).send(reject);
                });
            }, function (fail) {
                console.error(fail);
            });
        }
        if (params.middleware) {
            return (_a = me.router)[params.type].apply(_a, [params.path].concat(params.middleware, [returnCallback]));
        }
        return me.router[params.type](params.path, returnCallback);
        var _a;
    };
    return ControllerBase;
}());
exports.__esModule = true;
exports["default"] = ControllerBase;
