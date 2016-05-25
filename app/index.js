"use strict";

var _ = require('lodash'),
    bulkRequire = require("bulk-require");
module.exports = initModule;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = initModule;
function initModule() {
    var apiOptions = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var apiClasses = bulkRequire(__dirname + "/services", ["!(APIBase)*.js"]);
    _.each(apiClasses, function (apiClass, apiName) {
        if (_.isEmpty(apiOptions)) {
            apiClasses[apiName] = apiClass.default;
            return;
        }
        apiClasses[apiName] = new apiClass.default(_.clone(apiOptions, true));
    });
    return apiClasses;
}
module.exports.verifyHttps = function (req, res, next) {
    if (!req.connection.encrypted) {
        res.status(505).send("HTTP Not Supported");
        return;
    }
    next();
};
module.exports.allowOrigins = function (allowedOrigins) {
    return function (req, res, next) {
        var _ = require("lodash");
        var origin = req.headers.origin;

        if (allowedOrigins && !_.contains(allowedOrigins, origin)) {
            res.status(403).send("Origin: " + origin + " Not Allowed");
            return;
        }
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS, DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, X-SPSESSION');
        res.header('Access-Control-Allow-Origin', '*');
        next();
    };
};
module.exports.managePermissions = function (req, res, next) {
    if (req.method === 'OPTIONS') {
        next();
        return;
    }
    var site = req.params.site || req.query.site || req.body && req.body.site;
    var Symphony = require("sy-trans")({
        basicAuth: req.get("Authorization"),
        cookieAuth: req.get("X-SPSESSION"),
        env: req.query.env
    });
    Symphony.Member.checkPermissions(site).then(function (result) {
        if (result.hasPermissions) {
            req.permissions = result;
            next();
        } else {
            res.status(403).send({ message: 'Forbidden - Bad Authentication' });
        }
    }, function (fail) {
        var failError = fail.error || {};
        res.status(fail.error.code || 403).send(failError);
    });
};