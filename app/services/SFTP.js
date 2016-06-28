"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Service_Base_1 = require('./../bases/Service-Base');
var _ = require('lodash'), ssh2 = require('ssh2'), Readable = require('stream').Readable, async = require('async');
var SFTP = (function (_super) {
    __extends(SFTP, _super);
    function SFTP(options) {
        _super.call(this);
        this.options = options;
    }
    SFTP.prototype.initSFTP = function () {
        var _this = this;
        var deferred = this.deferred();
        var conn = new ssh2();
        var limit = 20;
        this.options.attempts = 0;
        conn.on('ready', function () { return deferred.resolve(conn); })
            .on('error', function (err) {
            if (_this.options.attempts > limit) {
                deferred.reject(err);
            }
            _this.options.attempts++;
            conn.connect(_this.options);
        });
        conn.connect(this.options);
        return deferred.promise;
    };
    SFTP.prototype.readDir = function (path) {
        var _this = this;
        return this.initSFTP().then(function (conn) {
            var deferred = _this.deferred();
            conn.sftp(function (err, sftp) {
                if (err)
                    deferred.reject(err);
                sftp.readdir(path, function (err, list) {
                    if (err)
                        deferred.reject(err);
                    sftp.end();
                    deferred.resolve(list);
                });
            });
            return deferred.promise;
        });
    };
    SFTP.prototype.readFile = function (file) {
        var _this = this;
        return this.initSFTP().then(function (conn) {
            var deferred = _this.deferred();
            conn.sftp(function (err, sftp) {
                if (err)
                    deferred.reject(err);
                var stream = sftp.createReadStream(file.path);
                var content = "";
                stream.on('data', function (chunk) {
                    content += chunk;
                })
                    .on('end', function () {
                    conn.end();
                    deferred.resolve(content);
                })
                    .on('error', function (err) {
                    sftp.end();
                    deferred.reject(err);
                });
            });
            return deferred.promise;
        });
    };
    SFTP.prototype.writeFile = function (file) {
        var _this = this;
        this.initSFTP().then(function (conn) {
            var deferred = _this.deferred();
            conn.sftp(function (err, sftp) {
                var writeStream = sftp.createWriteStream(file.path);
                var readStream = new Readable();
                readStream.push(file.content);
                readStream.push(null);
                writeStream.on('close', function () {
                    conn.end();
                    deferred.resolve(file);
                });
                readStream.pipe(writeStream);
            });
            return deferred.promise;
        });
    };
    SFTP.prototype.moveFile = function (fromPath, toPath) {
        var _this = this;
        this.initSFTP().then(function (conn) {
            var deferred = _this.deferred();
            conn.sftp(function (err, sftp) {
                if (err)
                    deferred.reject(err);
                sftp.rename(fromPath, toPath, function (err, data) {
                    if (err)
                        deferred.reject(err);
                    sftp.end();
                    deferred.resolve(data);
                });
            });
            return deferred.promise;
        });
    };
    return SFTP;
}(Service_Base_1["default"]));
exports.__esModule = true;
exports["default"] = SFTP;
;
