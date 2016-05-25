///<reference path="../../typings/node/node.d.ts"/>
///<reference path="../interfaces/ApiOptions.ts"/>
///<reference path="../interfaces/ApiHeaders.ts"/>
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Service_Base_1 = require('./../bases/Service-Base');
var btoa2 = require("btoa");

var APIBase = function (_Service_Base_1$defau) {
    _inherits(APIBase, _Service_Base_1$defau);

    function APIBase(apiOptions) {
        _classCallCheck(this, APIBase);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(APIBase).call(this));

        var manageEnv = apiOptions.env || "manage";
        _this.headers = {
            "Accept": "application/json",
            "Content-Type": "application/json"
        };
        _this.logger = apiOptions.logger ? apiOptions.logger : console;
        _this.apiPath = apiOptions.apiPath;
        _this.baseUrl = "https://" + manageEnv + ".symphonycommerce.com";
        if (apiOptions.basicAuth) {
            _this.headers["Authorization"] = apiOptions.basicAuth;
            return _possibleConstructorReturn(_this);
        }
        if (apiOptions.email && apiOptions.password) {
            _this.headers["Authorization"] = "Basic " + btoa2(apiOptions.email + ":" + apiOptions.password);
            return _possibleConstructorReturn(_this);
        }
        if (apiOptions.sessionId) {
            _this.headers["Cookie"] = "SPSESSIONID=" + apiOptions.sessionId;
            return _possibleConstructorReturn(_this);
        }
        if (apiOptions.cookieAuth) {
            _this.headers["Cookie"] = apiOptions.cookieAuth;
            return _possibleConstructorReturn(_this);
        }
        return _this;
    }

    return APIBase;
}(Service_Base_1.default);

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = APIBase;