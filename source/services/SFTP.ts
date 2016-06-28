import ServiceBase from './../bases/Service-Base';

const _ = require('lodash'),
      ssh2 = require('ssh2'),
      Readable = require('stream').Readable,
      async = require('async');

export default class SFTP extends ServiceBase {
    constructor(private options) {
        super();
    }

    initSFTP () {
        const deferred = this.deferred();
        const conn = new ssh2();
        const limit = 40;

        this.options.attempts = 0;
        conn.on('ready', () => deferred.resolve(conn))
            .on('error', (err) => {
                if (this.options.attempts > limit) {
                    deferred.reject(err);
                }
                this.options.attempts++;
                conn.connect(this.options);
            });

        conn.connect(this.options);
        return deferred.promise;
    }

    readDir (path: string) { 
        return this.initSFTP().then((conn) => {
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
        return this.initSFTP().then((conn) => {
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
                    sftp.end();
                    deferred.reject(err);
                });
            });

            return deferred.promise;
        });
    }

    writeFile (file: any) {

        return this.initSFTP().then((conn) => {
            const deferred = this.deferred();
            conn.sftp((err, sftp) => {

                const writeStream = sftp.createWriteStream(file.path);
                const readStream = new Readable();
                readStream.push(file.content);
                readStream.push(null);

                writeStream.on('close', () => {
                    conn.end();
                    deferred.resolve(file);
                });

                readStream.pipe(writeStream);
            });

            return deferred.promise;
        });
    }

    moveFile (fromPath: string, toPath: string) {
        return this.initSFTP().then((conn) => {
            const deferred = this.deferred();
            conn.sftp((err, sftp) => {
                if (err) deferred.reject(err);

                sftp.rename(fromPath, toPath, (err, data) => {
                    if (err) deferred.reject(err);

                    sftp.end();
                    deferred.resolve(data);
                });
            });

            return deferred.promise;
        });
    }
};