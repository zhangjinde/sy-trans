///<reference path='APIBase.ts'/>
///<reference path='../interfaces/ApiOptions.ts'/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var APIBase_1 = require('./APIBase');
var _ = require('lodash'), ssh2 = require('ssh2'), Readable = require('stream').Readable, async = require('async');
var SFTP = (function (_super) {
    __extends(SFTP, _super);
    function SFTP(options) {
        _super.call(this, options);
    }
    SFTP.prototype.connect = function (options, callback) {
        var me = this, conn = new ssh2();
        conn.on('ready', function () {
            conn.sftp(function (err, sftp) {
                callback(err, sftp);
            });
        });
        conn.connect(options);
    };
    SFTP.prototype.readDir = function (options, file) {
        var conn = new ssh2(), deferred = this.deferred();
        conn.connect(function (err, sftp) {
            if (err)
                deferred.reject(err);
            sftp.readdir(file.path, function (err, list) {
                if (err)
                    deferred.reject(err);
                sftp.end();
                deferred.resolve(list);
            });
        });
        return deferred.promise;
    };
    SFTP.prototype.readFile = function (options, file) {
        var conn = new ssh2(), deferred = this.deferred(), limit = 20;
        options.attempts = 0;
        conn.on('ready', function () {
            conn.sftp(function (err, sftp) {
                var stream = sftp.createReadStream(file.path);
                var content = "";
                stream.on('data', function (chunk) {
                    content += chunk;
                }).on('end', function () {
                    conn.end();
                    deferred.resolve(content);
                }).on('error', function (err) {
                    sftp.end();
                    deferred.reject(err);
                });
            });
        }).on('error', function (err) {
            if (options.attempts > limit) {
                deferred.reject(err);
            }
            options.attempts++;
            conn.connect(options);
        });
        conn.connect(options);
        return deferred.promise;
    };
    SFTP.prototype.writeFile = function (options, file) {
        var conn = new ssh2(), deferred = this.deferred(), limit = 20;
        options.attempts = 0;
        conn.on('ready', function () {
            conn.sftp(function (err, sftp) {
                var writeStream = sftp.createWriteStream(file.path);
                var readStream = new Readable();
                readStream.push(file.content);
                readStream.push(null);
                writeStream.on('close', function () {
                    conn.end();
                    deferred.resolve(file.path);
                });
                readStream.pipe(writeStream);
            });
        }).on('error', function (err) {
            if (options.attempts > limit) {
                deferred.reject(err);
            }
            options.attempts++;
            conn.connect(options);
        });
        conn.connect(options);
        return deferred.promise;
    };
    SFTP.prototype.moveFile = function (fromPath, toPath, options) {
        var conn = new ssh2(), deferred = this.deferred(), limit = 20;
        options.attempts = 0;
        conn.on('ready', function () {
            conn.sftp(function (err, sftp) {
                if (err)
                    deferred.reject(err);
                sftp.rename(fromPath, toPath, function (err, response) {
                    if (err) {
                        deferred.reject(err);
                    }
                    sftp.end();
                    deferred.resolve(response);
                });
            });
        }).on('error', function (err) {
            if (options.attempts > limit) {
                deferred.reject(err);
            }
            options.attempts++;
            conn.connect(options);
        });
        conn.connect(options);
        return deferred.promise;
    };
    return SFTP;
}(APIBase_1["default"]));
exports.__esModule = true;
exports["default"] = SFTP;
;
