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
var ssh2 = require('ssh2');
var async = require('async');
var Readable = require('stream').Readable;
var SFTP = (function (_super) {
    __extends(SFTP, _super);
    function SFTP(options) {
        _super.call(this);
        this.options = options;
        this.files = [];
        this.errors = [];
    }
    SFTP.prototype.initSFTP = function (files) {
        var _this = this;
        var deferred = this.deferred();
        var conn = new ssh2();
        /* Attempt to connect 10 times. Throw error after attempt limit is exceeded. */
        var limit = 10;
        var attempts = 0;
        conn.on('ready', function () { return deferred.resolve(conn); })
            .on('error', function (err) {
            if (attempts > limit) {
                deferred.reject(err);
            }
            attempts++;
            conn.connect(_this.options);
        });
        conn.connect(this.options);
        return deferred.promise;
    };
    SFTP.prototype.makeQ = function (conn, files, method) {
        var _this = this;
        /* If file object passed into any of read/write functions,
        add it to array to push through Q. */
        if (!Array.isArray(files)) {
            files = [files];
        }
        this.files = _.concat(this.files, files);
        var deferred = this.deferred();
        /* Concurrency defines how many files are read/written at one time in Q. */
        this.concurrency = this.options.concurrency &&
            this.options.concurrency < 20 ?
            this.options.concurrency : this.concurrency;
        var q = async.queue(function (file, callback) {
            /* Perform method passed into makeQ (e.g. readFile, writeFile) */
            return method(file)
                .then(function (response) {
                callback(null, response);
            })
                .catch(function (err) {
                callback(err, file);
            });
        }, this.concurrency);
        q.drain = function () {
            conn.end();
            /* If any file encountered errors, the error is pushed into the this.error array,
            and if any errors present at end of Q, reject promise with error(s). */
            if (_this.errors.length) {
                deferred.reject(_this.errors);
            }
            deferred.resolve(_this.files);
        };
        _.each(this.files, function (file) {
            q.push(file, function (err, f) {
                if (err) {
                    _this.errors.push({
                        error: err,
                        file: f.path
                    });
                }
            });
        });
        return deferred.promise;
    };
    SFTP.prototype.readDir = function (path) {
        var _this = this;
        var file = { path: path };
        return this.initSFTP(file).then(function (conn) {
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
    SFTP.prototype.readFile = function (files) {
        var _this = this;
        return this.initSFTP(files).then(function (conn) {
            return _this.makeQ(conn, files, function (file) {
                var deferred = _this.deferred();
                conn.sftp(function (err, sftp) {
                    if (err)
                        deferred.reject(err);
                    var readStream = sftp.createReadStream(file.path);
                    var content = "";
                    readStream
                        .on('data', function (chunk) {
                        content += chunk;
                    })
                        .on('end', function () {
                        sftp.end();
                        conn.end();
                        deferred.resolve(content);
                    })
                        .on('error', function (err) {
                        sftp.end();
                        conn.end();
                        deferred.reject(err);
                    });
                });
                return deferred.promise;
            });
        });
    };
    SFTP.prototype.writeFile = function (files) {
        var _this = this;
        return this.initSFTP(files).then(function (conn) {
            return _this.makeQ(conn, files, function (file) {
                var deferred = _this.deferred();
                conn.sftp(function (err, sftp) {
                    if (err) {
                        deferred.reject(err);
                    }
                    ;
                    var writeStream = sftp.createWriteStream(file.path);
                    var readStream = new Readable();
                    readStream
                        .on('error', function (err) {
                        sftp.end();
                        deferred.reject(err);
                    });
                    readStream.push(file.content);
                    readStream.push(null);
                    writeStream
                        .on('close', function () {
                        sftp.end();
                        deferred.resolve(file);
                    })
                        .on('error', function (err) {
                        sftp.end();
                        deferred.reject(err);
                    });
                    readStream.pipe(writeStream);
                });
                return deferred.promise;
            });
        });
    };
    SFTP.prototype.moveFile = function (fromPath, toPath) {
        var _this = this;
        var file = { fromPath: fromPath, toPath: toPath, attempts: 0 };
        return this.initSFTP(file).then(function (conn) {
            var deferred = _this.deferred();
            conn.sftp(function (err, sftp) {
                if (err)
                    deferred.reject(err);
                sftp.rename(fromPath, toPath, function (err, data) {
                    if (err)
                        deferred.reject(err);
                    sftp.end();
                    deferred.resolve(file);
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
