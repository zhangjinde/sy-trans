"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var APIBase_1 = require('./APIBase');
var _ = require('lodash'),
    ssh2 = require('ssh2'),
    Readable = require('stream').Readable,
    async = require('async'),
    slackLog = {
    alertMessage: process.env.ALERT_MESSAGE,
    channel: process.env.ALERT_CHANNEL
};

var SFTP = function (_APIBase_1$default) {
    _inherits(SFTP, _APIBase_1$default);

    function SFTP(config) {
        _classCallCheck(this, SFTP);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SFTP).call(this));

        _this.logger = _this.services.logger;
        return _this;
    }

    _createClass(SFTP, [{
        key: 'connect',
        value: function connect(options, callback) {
            var me = this,
                conn = new ssh2();
            conn.on('ready', function () {
                conn.sftp(function (err, sftp) {
                    callback(err, sftp);
                });
            });
            conn.connect(options);
        }
    }, {
        key: 'readDir',
        value: function readDir(path, callback) {
            var me = this,
                conn = new ssh2();
            conn.connect(function (err, sftp) {
                if (err) return callback(err, null);
                sftp.readdir(path, function (err, list) {
                    if (err) return callback(err, null);
                    sftp.end();
                    return callback(null, list);
                });
            });
        }
    }, {
        key: 'readFile',
        value: function readFile(options, callback) {
            var me = this,
                conn = new ssh2(),
                limit = 20;
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
                        // me.logger.slackLog('Error reading file:', options.filename);
                        sftp.end();
                        return callback(err, null);
                    });
                });
            }).on('error', function (err) {
                if (options.attempts > limit) {
                    // me.logger.slackLog('Error connecting to sftp:', options.filename);
                    return callback(err, null);
                }
                options.attempts++;
                conn.connect(options);
            });
            conn.connect(options);
        }
    }, {
        key: 'writeFile',
        value: function writeFile(options, callback) {
            var me = this,
                conn = new ssh2(),
                limit = 20;
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
                    // me.logger.slackLog('Error connecting to sftp:', options.filepath);
                    return callback(err);
                }
                me.logger.error('Error connecting to SFTP:', options.filepath);
                options.attempts++;
                conn.connect(options);
            });
            conn.connect(options);
        }
    }, {
        key: 'moveFile',
        value: function moveFile(fromPath, toPath, options, callback) {
            var me = this,
                conn = new ssh2(),
                limit = 20;
            options.attempts = 0;
            conn.on('ready', function () {
                conn.sftp(function (err, sftp) {
                    if (err) return callback(err, null);
                    sftp.rename(fromPath, toPath, function (err, response) {
                        if (err) {
                            // me.slackLog('Error moving original file:', options.filepath);
                            return callback(err, null);
                        }
                        sftp.end();
                        return callback(err, response);
                    });
                });
            }).on('error', function (err) {
                if (options.attempts > limit) {
                    // me.logger.slackLog('Error connecting to sftp:', options.filepath);
                    return callback(err);
                }
                me.logger.error('Error connecting to SFTP:', options.filepath);
                options.attempts++;
                conn.connect(options);
            });
            conn.connect(options);
        }
    }]);

    return SFTP;
}(APIBase_1.default);

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SFTP;
;