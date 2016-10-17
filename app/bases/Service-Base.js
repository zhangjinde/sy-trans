///<reference path="../../typings/es6-promise/es6-promise.d.ts"/>
"use strict";
var _ = require('lodash');
var async = require('async');
var ServiceBase = (function () {
    function ServiceBase() {
    }
    ServiceBase.prototype.deferred = function () {
        var d = {
            promise: null,
            resolve: null,
            reject: null
        };
        d.promise = new Promise(function (resolve, reject) {
            d.resolve = resolve;
            d.reject = reject;
        });
        return d;
    };
    ServiceBase.prototype.makeQ = function (options, conn, files, method) {
        /* If file object passed into any of read/write functions,
        add it to array to push through Q (for backwards compatibility). */
        var singleFile;
        if (!Array.isArray(files)) {
            singleFile = true;
            files = [files];
        }
        var deferred = this.deferred();
        var errors = [];
        var successes = [];
        /* Concurrency defines how many files are read/written at one time in Q. */
        var concurrencyLimit = 20;
        var concurrency = options.concurrency &&
            options.concurrency < concurrencyLimit ?
            options.concurrency : concurrencyLimit;
        var q = async.queue(function (file, callback) {
            /* Perform method passed into makeQ (e.g. readFile, writeFile) */
            return method(file)
                .then(function (response) {
                callback(null, response);
            })
                .catch(function (err) {
                callback(err, file);
            });
        }, concurrency);
        q.drain = function () {
            conn.end();
            /* If any file encountered errors, the error is pushed into the error array,
            and if any errors present at end of Q, reject promise with error(s). */
            if (errors.length) {
                deferred.reject({ errors: errors, successes: successes });
            }
            if (singleFile && successes.length === 1)
                deferred.resolve(successes[0]);
            deferred.resolve(successes);
        };
        _.each(files, function (file) {
            q.push(file, function (err, f) {
                if (err) {
                    errors.push({
                        error: err,
                        file: f.path
                    });
                }
                else {
                    successes.push(f);
                }
            });
        });
        return deferred.promise;
    };
    return ServiceBase;
}());
exports.__esModule = true;
exports["default"] = ServiceBase;
