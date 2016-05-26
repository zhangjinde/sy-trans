"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path='../bases/Router-Options.ts'/>
///<reference path="../../typings/es6-promise/es6-promise.d.ts"/>
var Controller_Base_1 = require('../bases/Controller-Base');
var SFTP_1 = require('../services/SFTP');
var sftpService = new SFTP_1["default"](), managePermissions = require('node-symphony').managePermissions, verifyHttps = require('node-symphony').verifyHttps;
var TransferController = (function (_super) {
    __extends(TransferController, _super);
    function TransferController() {
        _super.call(this, {
            urlParams: ["site"]
        });
        this.routerPath = '/:site';
        this.writeFile = sftpService.writeFile.bind(sftpService);
        this.readFile = sftpService.readFile.bind(sftpService);
        this.moveFile = sftpService.moveFile.bind(sftpService);
    }
    TransferController.prototype.register = function () {
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
        });
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
    };
    return TransferController;
}(Controller_Base_1["default"]));
exports.__esModule = true;
exports["default"] = TransferController;
