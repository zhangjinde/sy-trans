///<reference path="../../typings/node/node.d.ts"/>
///<reference path="../../typings/es6-promise/es6-promise.d.ts"/>

import ServiceBase from './../bases/Service-Base';

const _ = require('lodash');
const ssh2 = require('ssh2');
const Readable = require('stream').Readable;

export default class SFTP extends ServiceBase {
    constructor(private options) {
        super();
    }

    initSFTP (file: any) {
        const deferred = this.deferred();
        const conn = new ssh2();
        const limit = 10;

        file.attempts = 0;
        conn.on('ready', () => deferred.resolve(conn))
            .on('error', (err) => {
                if (file.attempts > limit) {
                    deferred.reject(err);
                }
                file.attempts++;
                conn.connect(this.options);
            });

        conn.connect(this.options);
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

    readFile (file: any) {
        return this.initSFTP(file).then((conn) => {
            const deferred = this.deferred();
            conn.sftp((err, sftp) => {
                if (err) deferred.reject(err);

                const stream = sftp.createReadStream(file.path);

                let content = "";

                stream.on('data', (chunk) => {
                    content += chunk;
                })
                .on('end', () => {
                    conn.end();
                    deferred.resolve(content);
                })
                .on('error', (err) => {
                    conn.end();
                    deferred.reject(err);
                });
            });

            return deferred.promise;
        });
    }

    writeFile (file: any) {
        return this.initSFTP(file).then((conn) => {
            const deferred = this.deferred();
            conn.sftp((err, sftp) => {
                if (err) deferred.reject(err);

                const writeStream = sftp.createWriteStream(file.path);
                const readStream = new Readable();
                readStream.push(file.content);
                readStream.push(null);

                writeStream.on('close', () => {
                    conn.end();
                    deferred.resolve(file);
                })
                .on('error', (err) => {
                    conn.end();
                    deferred.reject(err);
                });

                readStream.pipe(writeStream);
            });

            return deferred.promise;
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