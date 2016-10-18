"use strict";
var FTP_1 = require('./services/FTP');
var SFTP_1 = require('./services/SFTP');
var Email_1 = require('./services/Email');
module.exports = initModule;
exports.__esModule = true;
exports["default"] = initModule;
function initModule(options) {
    var ftp = new FTP_1["default"](options);
    var sftp = new SFTP_1["default"](options);
    var email = new Email_1["default"](options);
    return {
        ftp: ftp, sftp: sftp, email: email
    };
}
