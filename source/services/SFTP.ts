///<reference path="../../typings/node/node.d.ts"/>
///<reference path="../../typings/es6-promise/es6-promise.d.ts"/>

import ServiceBase from './../bases/Service-Base';

const _ = require('lodash');
const ssh2 = require('ssh2');
const async = require('async');
const Readable = require('stream').Readable;

export default class SFTP extends ServiceBase {
    files: any;
    errors: any;
    concurrency: number;

    constructor(private options) {
        super();
        this.files = [];
        this.errors = [];
        this.concurrency = 20;
    }

    initSFTP (files: any) {        
        const deferred = this.deferred();
        const conn = new ssh2();
        /* Attempt to connect 10 times. Throw error after attempt limit is exceeded. */
        const limit = 10;
        let attempts = 0;

        conn.on('ready', () => deferred.resolve(conn))
            .on('error', (err) => {
                if (attempts > limit) {
                    deferred.reject(err);
                }
                attempts++;
                conn.connect(this.options);
            });

        conn.connect(this.options);
        return deferred.promise;
    }

    makeQ (conn: any, files: any, method: any) {
        /* If file object passed into any of read/write functions, 
        add it to array to push through Q. */
        if (!Array.isArray(files)) {
            files = [ files ];
        }
        this.files = _.concat(this.files, files);
        const deferred = this.deferred();

        /* Concurrency defines how many files are read/written at one time in Q. */
        this.concurrency = this.options.concurrency &&
                this.options.concurrency < 20 ?
                this.options.concurrency : this.concurrency;

        const q = async.queue((file, callback) => {
            /* Perform method passed into makeQ (e.g. readFile, writeFile) */
            return method(file)
                .then((response) => {
                    callback(null, response);
                })
                .catch((err) => {
                    callback(err, file);
                })
        }, this.concurrency);

        q.drain = () => {
            conn.end();
            /* If any file encountered errors, the error is pushed into the this.error array,
            and if any errors present at end of Q, reject promise with error(s). */
            if (this.errors.length) {
                deferred.reject(this.errors);
            }
            deferred.resolve(this.files);
        }

        _.each(this.files, (file) => {
            q.push(file, (err, f) => {
                if (err) {
                    this.errors.push({
                        error: err,
                        file: f.path
                    });
                }
            });
        });

        return deferred.promise;
    }

    readDir (path: string) { 
        const file = { path };
        return this.initSFTP(file).then((conn) => {
            const deferred = this.deferred();
            conn.sftp((err, sftp) => {
                if (err) deferred.reject(err);

                sftp.readdir(path, (err, list) => {
                    if (err) deferred.reject(err);

                    sftp.end();
                    deferred.resolve(list);
                });
            });

            return deferred.promise;
        });
    }

    readFile (files: any) {
        return this.initSFTP(files).then((conn) => {
            return this.makeQ(conn, files, (file) => {    
                const deferred = this.deferred();
                conn.sftp((err, sftp) => {
                    if (err) deferred.reject(err);

                    const readStream = sftp.createReadStream(file.path);

                    let content = "";

                    readStream
                        .on('data', (chunk) => {
                            content += chunk;
                        })
                        .on('end', () => {
                            sftp.end();
                            conn.end();
                            deferred.resolve(content);
                        })
                        .on('error', (err) => {
                            sftp.end();
                            conn.end();
                            deferred.reject(err);
                        });
                });

                return deferred.promise;
            });
        });
    }

    writeFile (files: any) {
        return this.initSFTP(files).then((conn) => {
            return this.makeQ(conn, files, (file) => {
                const deferred = this.deferred();
                conn.sftp((err, sftp) => {
                    if (err) {
                        deferred.reject(err);
                    };

                    const writeStream = sftp.createWriteStream(file.path);
                    const readStream = new Readable();

                    readStream
                        .on('error', (err) => {
                            sftp.end();
                            deferred.reject(err);
                        });

                    readStream.push(file.content);
                    readStream.push(null);

                    writeStream
                        .on('close', () => {
                            sftp.end();
                            deferred.resolve(file);
                        })
                        .on('error', (err) => {
                            sftp.end();
                            deferred.reject(err);
                        });

                    readStream.pipe(writeStream);
                });

                return deferred.promise;
            });
        });
    }

    moveFile (fromPath: string, toPath: string) {
        const file = { fromPath, toPath, attempts: 0 };
        return this.initSFTP(file).then((conn) => {
            const deferred = this.deferred();
            conn.sftp((err, sftp) => {
                if (err) deferred.reject(err);

                sftp.rename(fromPath, toPath, (err, data) => {
                    if (err) deferred.reject(err);

                    sftp.end();
                    deferred.resolve(file);
                });
            });

            return deferred.promise;
        });
    }
};