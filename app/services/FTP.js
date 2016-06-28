"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Service_Base_1 = require('./../bases/Service-Base');
var _ = require('lodash'), nodeFTP = require('ftp'), Readable = require('stream').Readable, Writable = require('stream').Writable, async = require('async');
var FTP = (function (_super) {
    __extends(FTP, _super);
    function FTP(options) {
        _super.call(this);
        this.options = options;
    }
    /* istanbul ignore next */
    FTP.prototype.initFTP = function () {
        var deferred = this.deferred();
        var ftp = new nodeFTP();
        this.options.user = this.options.username || this.options.user;
        ftp.on('ready', function () { return deferred.resolve(ftp); });
        ftp.on('error', deferred.reject);
        ftp.connect(this.options);
        return deferred.promise;
    };
    FTP.prototype.readDir = function (path) {
        var _this = this;
        return this.initFTP().then(function (ftp) {
            var deferred = _this.deferred();
            ftp.list(path, function (err, list) {
                if (err) {
                    deferred.reject(err);
                }
                deferred.resolve(list);
            });
            return deferred.promise;
        });
    };
    FTP.prototype.readFile = function (options, file) {
        var deferred = this.deferred();
        var ftp = new nodeFTP();
        options.user = options.username || options.user;
        ftp.on('ready', function () {
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
        });
        ftp.connect(options);
        return deferred.promise;
    };
    FTP.prototype.writeFile = function (options, file) {
        var ftp = new nodeFTP(), deferred = this.deferred(), limit = 20;
        options.attempts = 0;
        options.user = options.username || options.user;
        ftp.on('ready', function () {
            var writeStream = new Writable(file.path);
            var readStream = new Readable();
            readStream.push(file.content);
            readStream.push(null);
            ftp.put(readStream, file.path, function (err) {
                if (err) {
                    deferred.reject(err);
                }
                ftp.end();
                deferred.resolve({});
            });
        }).on('error', function (err) {
            if (options.attempts > limit) {
                deferred.reject(err);
            }
            options.attempts++;
            ftp.connect(options);
        });
        ftp.connect(options);
        return deferred.promise;
    };
    FTP.prototype.moveFile = function (options, fromPath, toPath) {
        var ftp = new nodeFTP(), deferred = this.deferred(), limit = 20;
        options.attempts = 0;
        options.user = options.username || options.user;
        ftp.on('ready', function () {
            ftp.rename(fromPath, toPath, function (err, data) {
                if (err) {
                    deferred.reject(err);
                }
                ftp.end();
                deferred.resolve({});
            });
        }).on('error', function (err) {
            if (options.attempts > limit) {
                deferred.reject(err);
            }
            options.attempts++;
            ftp.connect(options);
        });
        ftp.connect(options);
        return deferred.promise;
    };
    return FTP;
}(Service_Base_1["default"]));
exports.__esModule = true;
exports["default"] = FTP;
;
