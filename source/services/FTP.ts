import ServiceBase from './../bases/Service-Base';

const _ = require('lodash'),
      nodeFTP = require('ftp'),
      Readable = require('stream').Readable,
      Writable = require('stream').Writable,
      async = require('async');

export default class FTP extends ServiceBase {
  constructor(private options) {
    super();
  }

  /* istanbul ignore next */
  initFTP() {
    const deferred = this.deferred();
    const ftp = new nodeFTP();

    this.options.user = this.options.username || this.options.user;
    ftp.on('ready', () => deferred.resolve(ftp));
    ftp.on('error', deferred.reject);

    ftp.connect(this.options);
    return deferred.promise;
  }

  readDir(path: string) {
    return this.initFTP().then((ftp) => {
      const deferred = this.deferred();

      ftp.list(path, (err, list) => {
        if (err) {
          deferred.reject(err);
        }

        deferred.resolve(list);      
      });

      return deferred.promise;
    });
  }

  readFile(options: any, file: any) {
    const deferred = this.deferred();
    const ftp = new nodeFTP();

    options.user = options.username || options.user;
    ftp.on('ready', () => {
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
      })
    });

    ftp.connect(options);
    return deferred.promise;
  }

  writeFile (options: any, file: any) {

    const ftp = new nodeFTP(),
          deferred = this.deferred(),
          limit = 20;
    options.attempts = 0;
    options.user = options.username || options.user;

    ftp.on('ready', () => {
      const writeStream = new Writable(file.path);
      const readStream = new Readable();
      readStream.push(file.content);
      readStream.push(null);

      ftp.put(readStream, file.path, (err) => {
        if (err) {
          deferred.reject(err);
        }
        ftp.end();
        deferred.resolve({});
      });
    }).on('error', (err) => {
      if (options.attempts > limit) {
        deferred.reject(err);
      }
      options.attempts++;
      ftp.connect(options);
    });

    ftp.connect(options);
    return deferred.promise;
  }

  moveFile (options: any, fromPath: string, toPath: string) {

    const ftp = new nodeFTP(),
          deferred = this.deferred(),
          limit = 20;
    options.attempts = 0;
    options.user = options.username || options.user;

    ftp.on('ready', () => {

      ftp.rename(fromPath, toPath, (err, data) => {
        if (err) {
          deferred.reject(err);
        }
        ftp.end();
        deferred.resolve({});
      });
    }).on('error', (err) => {
      if (options.attempts > limit) {
        deferred.reject(err);
      }
      options.attempts++;
      ftp.connect(options);
    });

    ftp.connect(options);
    return deferred.promise;
  }

};
