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
        this.logger = this.services.logger;
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
    SFTP.prototype.readDir = function (path, callback) {
        var me = this, conn = new ssh2();
        conn.connect(function (err, sftp) {
            if (err)
                return callback(err, null);
            sftp.readdir(path, function (err, list) {
                if (err)
                    return callback(err, null);
                sftp.end();
                return callback(null, list);
            });
        });
    };
    SFTP.prototype.readFile = function (options, callback) {
        var me = this, conn = new ssh2(), limit = 20;
        options.attempts = 0;
        conn.on('ready', function () {
            me.logger.debug('connected to sftp to download file');
            conn.sftp(function (err, sftp) {
                var stream = sftp.createReadStream(options.filepath);
                var content = "";
                stream.on('data', function (chunk) {
                    content += chunk;
                }).on('end', function () {
                    conn.end();
                    return callback(null, content);
                }).on('error', function (err) {
                    sftp.end();
                    return callback(err, null);
                });
            });
        }).on('error', function (err) {
            if (options.attempts > limit) {
                return callback(err, null);
            }
            options.attempts++;
            conn.connect(options);
        });
        conn.connect(options);
    };
    SFTP.prototype.writeFile = function (options, callback) {
        var me = this, conn = new ssh2(), limit = 20;
        options.attempts = 0;
        conn.on('ready', function () {
            me.logger.debug('connected');
            conn.sftp(function (err, sftp) {
                var writeStream = sftp.createWriteStream(options.filepath);
                var readStream = new Readable();
                readStream.push(options.content);
                readStream.push(null);
                writeStream.on('close', function () {
                    me.logger.info('Successfully uploaded file to FTPS server:', options.filepath);
                    conn.end();
                    return callback(null, options.filepath);
                });
                readStream.pipe(writeStream);
            });
        }).on('error', function (err) {
            if (options.attempts > limit) {
                return callback(err);
            }
            me.logger.error('Error connecting to SFTP:', options.filepath);
            options.attempts++;
            conn.connect(options);
        });
        conn.connect(options);
    };
    SFTP.prototype.moveFile = function (fromPath, toPath, options, callback) {
        var me = this, conn = new ssh2(), limit = 20;
        options.attempts = 0;
        conn.on('ready', function () {
            conn.sftp(function (err, sftp) {
                if (err)
                    return callback(err, null);
                sftp.rename(fromPath, toPath, function (err, response) {
                    if (err) {
                        return callback(err, null);
                    }
                    sftp.end();
                    return callback(err, response);
                });
            });
        }).on('error', function (err) {
            if (options.attempts > limit) {
                return callback(err);
            }
            me.logger.error('Error connecting to SFTP:', options.filepath);
            options.attempts++;
            conn.connect(options);
        });
        conn.connect(options);
    };
    return SFTP;
}(APIBase_1["default"]));
exports.__esModule = true;
exports["default"] = SFTP;
;
