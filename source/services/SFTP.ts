///<reference path='APIBase.ts'/>
///<reference path='../interfaces/ApiOptions.ts'/>

import APIBase from './APIBase';
const _ = require('lodash'),
      ssh2 = require('ssh2'),
      Readable = require('stream').Readable,
      async = require('async');

export default class SFTP extends APIBase {

  logger: any;

  constructor(options: ApiOptions) {
    super(options);
  }

  connect (options: any, callback: any) {

    const me = this,
          conn = new ssh2();

    conn.on('ready', () => {
      conn.sftp((err, sftp) => {
        callback(err, sftp);
      });
    });

    conn.connect(options);

  }

  readDir (options: any, file: any) {

    const conn = new ssh2(),
          deferred = this.deferred();

    conn.connect((err, sftp) => {
      if (err) deferred.reject(err);

      sftp.readdir(file.path, (err, list) => {
        if (err) deferred.reject(err);

        sftp.end();
        deferred.resolve(list);
      });
    });

    return deferred.promise;
  }

  readFile (options: any, file: any) {

    const conn = new ssh2(),
          deferred = this.deferred(),
          limit = 20;

    options.attempts = 0;

    conn.on('ready', () => {

      conn.sftp((err, sftp) => {
        const stream = sftp.createReadStream(file.path);

        let content = "";

        stream.on('data', (chunk) => {
          content += chunk;
        }).on('end', () => {
          conn.end();
          deferred.resolve(content);
        }).on('error', (err) => {
          sftp.end();
          deferred.reject(err);
        });

      });

    }).on('error', (err) => {
      if (options.attempts > limit) {
        deferred.reject(err);
      }

      options.attempts++;
      conn.connect(options);
    });

    conn.connect(options);
    return deferred.promise;
  }

  writeFile (options: any, file: any) {

    const conn = new ssh2(),
          deferred = this.deferred(),
          limit = 20;

    options.attempts = 0;

    conn.on('ready', () => {
      conn.sftp((err, sftp) => {

        const writeStream = sftp.createWriteStream(file.path);
        const readStream = new Readable();
        readStream.push(file.content);
        readStream.push(null);

        writeStream.on('close', () => {
          conn.end();
          deferred.resolve(file.path);
        });

        readStream.pipe(writeStream);
      });

    }).on('error', (err) => {
      if (options.attempts > limit) {
        deferred.reject(err);
      }
      options.attempts++;
      conn.connect(options);
    });

    conn.connect(options);
    return deferred.promise;
  }

  moveFile (fromPath: string, toPath: string, options: any) {

    const conn = new ssh2(),
          deferred = this.deferred(),
          limit = 20;

    options.attempts = 0;

    conn.on('ready', () => {

      conn.sftp((err, sftp) => {
        if (err) deferred.reject(err);

        sftp.rename(fromPath, toPath, (err, response) => {
          if (err) {
            deferred.reject(err);
          }
          sftp.end();
          deferred.resolve(response);
        });
      });

    }).on('error', (err) => {
      if (options.attempts > limit) {
        deferred.reject(err);
      }
      options.attempts++;
      conn.connect(options);
    });

    conn.connect(options);
    return deferred.promise;
  }

};