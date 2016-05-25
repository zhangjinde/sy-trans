///<reference path='../bases/Router-Options.ts'/>
///<reference path="../../typings/es6-promise/es6-promise.d.ts"/>
import ControllerBase from '../bases/Controller-Base';
import SFTPService from '../services/SFTP';

const sftpService = new SFTPService(),
      managePermissions = require('node-symphony').managePermissions,
      verifyHttps = require('node-symphony').verifyHttps;

export default class TransferController extends ControllerBase {
  routerPath: string;
  routerOptions: RouterOptions;
  writeFile: any;
  readFile: any;
  moveFile: any;

  constructor() {
    super({
      urlParams: ["site"]
    });

    this.routerPath = '/:site';
    this.writeFile = sftpService.writeFile.bind(sftpService);
    this.readFile = sftpService.readFile.bind(sftpService);
    this.moveFile = sftpService.moveFile.bind(sftpService);
  }

  register() {

    this.createPath({
      type: "post",
      path: '/uploadTest',
      urlParams: ['site'],
      queryParams: [],
      bodyParams: [
        'filepath',
        'hostname',
        'user',
        'password'
      ],
      callback: this.writeFile.bind(this)
    })

    this.createPath({
      type: "post",
      path: '/downloadTest',
      middleware: [managePermissions],
      urlParams: ['site'],
      queryParams: [],
      bodyParams: [
        'filepath',
        'hostname',
        'user',
        'password'
      ],
      callback: this.readFile.bind(this)
    });

    return this.router;
  }
}