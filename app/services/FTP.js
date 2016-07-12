///<reference path="../../typings/node/node.d.ts"/>
///<reference path="../../typings/es6-promise/es6-promise.d.ts"/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Service_Base_1 = require('./../bases/Service-Base');
var _ = require('lodash');
var nodeFTP = require('ftp');
var Readable = require('stream').Readable;
var FTP = (function (_super) {
    __extends(FTP, _super);
    function FTP(options) {
        _super.call(this);
        this.options = options;
    }
    /* istanbul ignore next */
    FTP.prototype.initFTP = function (file) {
        var _this = this;
        var deferred = this.deferred();
        var ftp = new nodeFTP();
        var limit = 40;
        file.attempts = 0;
        this.options.user = this.options.username || this.options.user;
        ftp.on('ready', function () { return deferred.resolve(ftp); });
        ftp.on('error', function (err) {
            if (file.attempts > limit) {
                deferred.reject(err);
            }
            file.attempts++;
            ftp.connect(_this.options);
        });
        ftp.connect(this.options);
        return deferred.promise;
    };
    FTP.prototype.readDir = function (path) {
        var _this = this;
        var file = { path: path };
        return this.initFTP(file).then(function (ftp) {
            var deferred = _this.deferred();
            ftp.list(path, function (err, list) {
                if (err)
                    deferred.reject(err);
                deferred.resolve(list);
            });
            return deferred.promise;
        });
    };
    FTP.prototype.readFile = function (file) {
        var _this = this;
        return this.initFTP(file).then(function (ftp) {
            var deferred = _this.deferred();
            ftp.get(file.path, function (err, stream) {
                if (err) {
                    deferred.reject(err);
                }
                var content = "";
                stream.on('data', function (chunk) {
                    content += chunk;
                }).on('end', function () {
                    ftp.end();
                    deferred.resolve(content);
                }).on('error', function (err) {
                    ftp.end();
                    deferred.reject(err);
                });
            });
            return deferred.promise;
        });
    };
    FTP.prototype.writeFile = function (file) {
        var _this = this;
        return this.initFTP(file).then(function (ftp) {
            var deferred = _this.deferred();
            var readStream = new Readable();
            readStream.push(file.content);
            readStream.push(null);
            ftp.put(readStream, file.path, function (err) {
                if (err) {
                    deferred.reject(err);
                }
                ftp.end();
                deferred.resolve(file);
            });
            return deferred.promise;
        });
    };
    FTP.prototype.moveFile = function (fromPath, toPath) {
        var _this = this;
        var file = { fromPath: fromPath, toPath: toPath };
        return this.initFTP(file).then(function (ftp) {
            var deferred = _this.deferred();
            ftp.rename(fromPath, toPath, function (err, data) {
                if (err) {
                    deferred.reject(err);
                }
                ftp.end();
                deferred.resolve(file);
            });
            return deferred.promise;
        });
    };
    return FTP;
}(Service_Base_1["default"]));
exports.__esModule = true;
exports["default"] = FTP;
;
