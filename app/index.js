"use strict";
var FTP_1 = require('./services/FTP');
var SFTP_1 = require('./services/SFTP');
var S3_1 = require('./services/S3');
module.exports = initModule;
exports.__esModule = true;
exports["default"] = initModule;
function initModule(options) {
    var ftp = new FTP_1["default"](options);
    var sftp = new SFTP_1["default"](options);
    var s3 = new S3_1["default"](options);
    return {
        ftp: ftp, sftp: sftp, s3: s3
    };
}
