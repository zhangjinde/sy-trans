///<reference path="../../typings/node/node.d.ts"/>
///<reference path="../../typings/es6-promise/es6-promise.d.ts"/>

import ServiceBase from './../bases/Service-Base';

const _ = require('lodash');
const nodeFTP = require('ftp');
const Readable = require('stream').Readable;

export default class FTP extends ServiceBase {
    constructor(private options) {
        super();
    }

    /* istanbul ignore next */
    initFTP(file: any) {
        const deferred = this.deferred();
        const ftp = new nodeFTP();
        const limit = 40;
        file.attempts = 0;

        this.options.user = this.options.username || this.options.user;
        ftp.on('ready', () => deferred.resolve(ftp));
        ftp.on('error', (err) => {
            if (file.attempts > limit) {
                deferred.reject(err);
            }
            file.attempts++;
            ftp.connect(this.options);
        });

        ftp.connect(this.options);
        return deferred.promise;
    }

    readDir (path: string) {
        const file = { path };
        return this.initFTP(file).then((ftp) => {
            const deferred = this.deferred();

            ftp.list(path, (err, list) => {
                if (err) {
                    ftp.end();
                    deferred.reject(err);
                }
                ftp.end();
                deferred.resolve(list);      
            });

            return deferred.promise;
        });
    }

    readFile (file: any) {
        return this.initFTP(file).then((ftp) => {
            const deferred = this.deferred();
            ftp.get(file.path, (err, stream) => {
                if (err) {
                    ftp.end();
                    deferred.reject(err);
                }

                let content = "";
                
                stream
                    .on('data', (chunk) => {
                        content += chunk;
                    }).on('end', () => {
                        ftp.end();
                        deferred.resolve(content);
                    }).on('error', (err) => {
                        ftp.end();
                        deferred.reject(err);
                    });
            });

            return deferred.promise;
        });
    }

    writeFile (files: any) {
        return this.initFTP(files).then((ftp) => {
            return this.makeQ(this.options, ftp, files, (file) => {
                const deferred = this.deferred();
                const readStream = new Readable();

                readStream.push(file.content);
                readStream.push(null);

                ftp.put(readStream, file.path, (err) => {
                    if (err) {
                        // ftp.end();
                        deferred.reject(err);
                    }
                    // ftp.end();
                    deferred.resolve(file);
                });

                return deferred.promise;
            });
        });
    }

    moveFile (fromPath: string, toPath: string) {
        const file = { fromPath, toPath };
        return this.initFTP(file).then((ftp) => {
            const deferred = this.deferred();
            ftp.rename(fromPath, toPath, (err, data) => {
                if (err) {
                    ftp.end();
                    deferred.reject(err);
                }
                ftp.end();
                deferred.resolve(file);
            });
            return deferred.promise;
        });
    }

};
