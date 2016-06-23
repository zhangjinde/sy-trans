///<reference path='APIBase.ts'/>
///<reference path='../interfaces/ApiOptions.ts'/>

import APIBase from './APIBase';
const _ = require('lodash'),
      nodeFTP = require('ftp'),
      Readable = require('stream').Readable,
      Writable = require('stream').Writable,
      async = require('async');

export default class FTP extends APIBase {

  logger: any;

  constructor(options: ApiOptions) {
    super(options);
  }

  readDir(options: any, path: string) {

    options.user = options.username ? options.username : options.user;
    const deferred = this.deferred();
    const me = this,
          ftp = new nodeFTP();
    ftp.on('ready', () => {
      ftp.list(path, (err, list) => {
        if (err) {
          // throw err;
          deferred.reject(err);
        }
        deferred.resolve(list);      
      });
    });


    ftp.on('error', (err) => {
      deferred.reject(err);
    });

    ftp.connect(options);
    return deferred.promise;
  }

  readFile(options: any, file: any) {

    options.user = options.username ? options.username : options.user;
    const deferred = this.deferred();
    const ftp = new nodeFTP();

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

    options.user = options.username ? options.username : options.user;
    const ftp = new nodeFTP(),
          deferred = this.deferred(),
          limit = 20;
    options.attempts = 0;

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

    options.user = options.username ? options.username : options.user;
    const ftp = new nodeFTP(),
          deferred = this.deferred(),
          limit = 20;
    options.attempts = 0;

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
