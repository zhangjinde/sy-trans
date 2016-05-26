///<reference path='../interfaces/ApiOptions.ts'/>

import APIBase from './APIBase';
const _ = require('lodash'),
      ssh2 = require('ssh2'),
      Readable = require('stream').Readable,
      async = require('async');
      // slackLog = {
      //   alertMessage: process.env.ALERT_MESSAGE,
      //   channel: process.env.ALERT_CHANNEL
      // };

export default class SFTP extends APIBase {

  logger: any;

  constructor(options: ApiOptions) {
    super();
    // this.logger = this.services.logger; 
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

  readDir (path: string, callback: any) {

    const me = this,
          conn = new ssh2();

    conn.connect((err, sftp) => {
      if (err) return callback(err, null);

      sftp.readdir(path, (err, list) => {
        if (err) return callback(err, null);

        sftp.end();
        return callback(null, list);
      });
    });

  }

  readFile (options: any, callback: any) {

    const me = this,
          conn = new ssh2(),
          limit = 20;

    options.attempts = 0;

    conn.on('ready', () => {
      me.logger.debug('connected to sftp to download file');
      conn.sftp((err, sftp) => {

        const stream = sftp.createReadStream(options.filepath);

        let content = "";

        stream.on('data', (chunk) => {
          content += chunk;
        }).on('end', () => {
          conn.end();
          return callback(null, content);
        }).on('error', (err) => {
          // me.logger.slackLog('Error reading file:', options.filename);
          sftp.end();
          return callback(err, null);
        });

      });

    }).on('error', (err) => {
      if (options.attempts > limit) {
        // me.logger.slackLog('Error connecting to sftp:', options.filename);
        return callback(err, null);
      }

      options.attempts++;
      conn.connect(options);
    });

    conn.connect(options);
  }

  writeFile (options: any, callback: any) {

    const me = this,
          conn = new ssh2(),
          limit = 20;

    options.attempts = 0;

    conn.on('ready', () => {
      me.logger.debug('connected');
      conn.sftp((err, sftp) => {

        const writeStream = sftp.createWriteStream(options.filepath);
        const readStream = new Readable();
        readStream.push(options.content);
        readStream.push(null);

        writeStream.on('close', () => {
          me.logger.info('Successfully uploaded file to FTPS server:', options.filepath);
          conn.end();
          return callback(null, options.filepath);
        });

        readStream.pipe(writeStream);
      });

    }).on('error', (err) => {
      if (options.attempts > limit) {
        // me.logger.slackLog('Error connecting to sftp:', options.filepath);
        return callback(err);
      }
      me.logger.error('Error connecting to SFTP:', options.filepath);
      options.attempts++;
      conn.connect(options);
    });

    conn.connect(options);

  }

  moveFile (fromPath: string, toPath: string, options: any, callback: any) {

    const me = this,
          conn = new ssh2(),
          limit = 20;

    options.attempts = 0;

    conn.on('ready', () => {

      conn.sftp((err, sftp) => {
        if (err) return callback(err, null);

        sftp.rename(fromPath, toPath, (err, response) => {
          if (err) {
            // me.slackLog('Error moving original file:', options.filepath);
            return callback(err, null);
          }
          sftp.end();
          return callback(err, response);
        });
      });

    }).on('error', (err) => {
      if (options.attempts > limit) {
        // me.logger.slackLog('Error connecting to sftp:', options.filepath);
        return callback(err);
      }
      me.logger.error('Error connecting to SFTP:', options.filepath);
      options.attempts++;
      conn.connect(options);
    });

    conn.connect(options);

  }

};