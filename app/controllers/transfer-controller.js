"use strict";
///<reference path='../bases/Router-Options.ts'/>
///<reference path="../../typings/es6-promise/es6-promise.d.ts"/>

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Controller_Base_1 = require('../bases/Controller-Base');
var SFTP_1 = require('../services/SFTP');
var sftpService = new SFTP_1.default(),
    managePermissions = require('node-symphony').managePermissions,
    verifyHttps = require('node-symphony').verifyHttps;

var TransferController = function (_Controller_Base_1$de) {
    _inherits(TransferController, _Controller_Base_1$de);

    function TransferController() {
        _classCallCheck(this, TransferController);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TransferController).call(this, {
            urlParams: ["site"]
        }));

        _this.routerPath = '/:site';
        _this.writeFile = sftpService.writeFile.bind(sftpService);
        _this.readFile = sftpService.readFile.bind(sftpService);
        _this.moveFile = sftpService.moveFile.bind(sftpService);
        return _this;
    }

    _createClass(TransferController, [{
        key: 'register',
        value: function register() {
            this.createPath({
                type: "post",
                path: '/uploadTest',
                urlParams: ['site'],
                queryParams: [],
                bodyParams: ['filepath', 'hostname', 'user', 'password'],
                callback: this.writeFile.bind(this)
            });
            this.createPath({
                type: "post",
                path: '/downloadTest',
                middleware: [managePermissions],
                urlParams: ['site'],
                queryParams: [],
                bodyParams: ['filepath', 'hostname', 'user', 'password'],
                callback: this.readFile.bind(this)
            });
            return this.router;
        }
    }]);

    return TransferController;
}(Controller_Base_1.default);

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TransferController;