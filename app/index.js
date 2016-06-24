"use strict";
var _ = require('lodash');
var bulkRequire = require("bulk-require");
module.exports = initModule;
exports.__esModule = true;
exports["default"] = initModule;
function initModule(apiOptions) {
    if (apiOptions === void 0) { apiOptions = {}; }
    var apiClasses = bulkRequire(__dirname + "/services", [
        "SFTP.js", "FTP.js"
    ]);
    _.each(apiClasses, function (apiClass, apiName) {
        if (_.isEmpty(apiOptions)) {
            apiClasses[apiName] = apiClass.default;
            return;
        }
        apiClasses[apiName] = new apiClass.default(_.clone(apiOptions, true));
    });
    return apiClasses;
}
