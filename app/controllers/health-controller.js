"use strict";
///<reference path='../bases/Router-Options.ts'/>
///<reference path="../../typings/es6-promise/es6-promise.d.ts"/>

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Controller_Base_1 = require('../bases/Controller-Base');
var Health_Service_1 = require('../services/Health-Service');
var healthService = new Health_Service_1.default(),
    verifyHttps = require('node-symphony').verifyHttps;

var YourController = function (_Controller_Base_1$de) {
    _inherits(YourController, _Controller_Base_1$de);

    function YourController() {
        _classCallCheck(this, YourController);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(YourController).call(this, {}));

        _this.routerPath = '';
        _this.getReport = healthService.getReport.bind(healthService);
        return _this;
    }

    _createClass(YourController, [{
        key: 'register',
        value: function register() {
            this.createPath({
                type: "get",
                path: '/health',
                middleware: [],
                urlParams: [],
                queryParams: [],
                bodyParams: [],
                callback: this.getReport
            });
            return this.router;
        }
    }]);

    return YourController;
}(Controller_Base_1.default);

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = YourController;