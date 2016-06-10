///<reference path='APIBase.ts'/>
///<reference path='../interfaces/ApiOptions.ts'/>

import APIBase from './APIBase';
const _ = require('lodash'),
      nodeFTP = require('ftp'),
      Readable = require('stream').Readable,
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
      ftp.list(options.directory, (err, list) => {
        if (err) {
          // throw err;
          return deferred.reject(err);
        }
        return deferred.promise;
      });
    });


    ftp.on('error', (err) => {
      return deferred.reject(err);
    });

    ftp.connect(options);

  }

  readFile (options: any, path: string) {

    const deferred = this.deferred();
  
    const ftp = new nodeFTP();

    ftp.on('ready', () => {
      ftp.get(path, (err, stream) => {
        if (err) {
          return deferred.reject(err);
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

  // writeFile (options: any, callback: any) {

  //   const me = this,
  //         conn = new ftp(),
  //         limit = 20;

  //   options.attempts = 0;

  //   conn.on('ready', () => {
  //     // me.logger.debug('connected');
  //     conn.sftp((err, sftp) => {

  //       const writeStream = sftp.createWriteStream(options.filepath);
  //       const readStream = new Readable();
  //       readStream.push(options.content);
  //       readStream.push(null);

  //       writeStream.on('close', () => {
  //         // me.logger.info('Successfully uploaded file to FTPS server:', options.filepath);
  //         conn.end();
  //         return callback(null, options.filepath);
  //       });

  //       readStream.pipe(writeStream);
  //     });

  //   }).on('error', (err) => {
  //     if (options.attempts > limit) {
  //       return callback(err);
  //     }
  //     // me.logger.error('Error connecting to SFTP:', options.filepath);
  //     options.attempts++;
  //     conn.connect(options);
  //   });

  //   conn.connect(options);

  // }

};