///<reference path="../../typings/node/node.d.ts"/>
///<reference path="../../typings/es6-promise/es6-promise.d.ts"/>
///<reference path="../bases/Router-Options.ts"/>
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Service_Base_1 = require('../bases/Service-Base');

var HealthService = function (_Service_Base_1$defau) {
    _inherits(HealthService, _Service_Base_1$defau);

    function HealthService() {
        _classCallCheck(this, HealthService);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(HealthService).call(this));

        _this.logger = _this.services.logger;
        _this.vitals = _this.services.vitals;
        return _this;
    }

    _createClass(HealthService, [{
        key: "getReport",
        value: function getReport() {
            return Promise.resolve(this.vitals.getReport());
        }
    }]);

    return HealthService;
}(Service_Base_1.default);

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HealthService;