import ServiceBase from './../bases/Service-Base';

const _ = require('lodash');
const nodeFTP = require('ftp');
const Readable = require('stream').Readable;

export default class FTP extends ServiceBase {
    constructor(private options) {
        super();
    }

    /* istanbul ignore next */
    initFTP() {
        const deferred = this.deferred();
        const ftp = new nodeFTP();
        const limit = 40;

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
                if (err) deferred.reject(err);
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
                    deferred.reject(err);
                }

                let content = "";
                stream.on('data', (chunk) => {
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

    writeFile (file: any) {
        return this.initFTP(file).then((ftp) => {

            const deferred = this.deferred();
            const readStream = new Readable();

            readStream.push(file.content);
            readStream.push(null);

            ftp.put(readStream, file.path, (err) => {
                if (err) {
                    deferred.reject(err);
                }
                ftp.end();
                deferred.resolve(file);
            });
            return deferred.promise;
        });
    }

    moveFile (fromPath: string, toPath: string) {
        const file = { fromPath, toPath, attempts: 0 };
        return this.initFTP().then((ftp) => {
            const deferred = this.deferred();
            ftp.rename(fromPath, toPath, (err, data) => {
                if (err) {
                    deferred.reject(err);
                }
                ftp.end();
                deferred.resolve(file);
            });
            return deferred.promise;
        });
    }

};
