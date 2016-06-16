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

  readFile(options: any, path: string) {

    const deferred = this.deferred();
  
    const ftp = new nodeFTP();

    ftp.on('ready', () => {
      ftp.get(path, (err, stream) => {
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

  writeFile (options: any, destPath: string, data: any) {

    const ftp = new nodeFTP(), 
          deferred = this.deferred(), 
          limit = 20;
    options.attempts = 0;

    ftp.on('ready', () => {
      const writeStream = new Writable(destPath);
      const readStream = new Readable();
      readStream.push(data);
      readStream.push(null);

      ftp.put(readStream, destPath, (err) => {
        if (err) {
          deferred.reject(err);
        }
        ftp.end();
        deferred.resolve({});
      });
    }).on('error', (err) => {
      console.log("error: ", err);
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