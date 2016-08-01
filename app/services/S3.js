///<reference path="../../typings/node/node.d.ts"/>
///<reference path="../../typings/es6-promise/es6-promise.d.ts"/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Service_Base_1 = require('./../bases/Service-Base');
var S3 = require('s3');
var S3Service = (function (_super) {
    __extends(S3Service, _super);
    /* options = {
        bucket, key, accessKey, secretAccessKey
    } */
    function S3Service(options) {
        _super.call(this);
        this.options = options;
    }
    S3Service.prototype.initS3 = function (file) {
        var options = this.options;
        var deferred = this.deferred();
        options.client = S3.createClient({
            maxAsyncS3: 20,
            s3RetryCount: 3,
            s3RetryDelay: 1000,
            multipartUploadThreshold: 20971520,
            multipartUploadSize: 15728640,
            s3Options: {
                accessKeyId: options.accessKeyId,
                secretAccessKey: options.secretAccessKey
            }
        });
        return deferred.resolve(options);
    };
    S3Service.prototype.readFile = function (file) { };
    S3Service.prototype.writeFile = function (file) {
        var _this = this;
        var params = {
            localFile: file.name,
            s3Params: {
                ACL: 'public-read',
                Bucket: this.options.bucket,
                Key: this.options.key
            },
            defaultContentType: file.name.split('.').pop()
        };
        return this.initS3(file).then(function (options) {
            var deferred = _this.deferred();
            var uploader = options.client.uploadFile(params);
            uploader
                .on('error', function (err) {
                return deferred.reject(err);
            })
                .on('end', function () {
                file.url = S3.getPublicUrlHttp(options.bucket, options.key);
                return deferred.resolve(file);
            });
        });
    };
    return S3Service;
}(Service_Base_1["default"]));
exports.__esModule = true;
exports["default"] = S3Service;
