///<reference path="../../typings/node/node.d.ts"/>
///<reference path="../interfaces/ApiOptions.ts"/>
///<reference path="../interfaces/ApiHeaders.ts"/>
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var btoa2 = require("btoa");

var APIBase = function APIBase(apiOptions) {
    _classCallCheck(this, APIBase);

    // super();
    var manageEnv = apiOptions.env || "manage";
    this.headers = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    };
    this.logger = apiOptions.logger ? apiOptions.logger : console;
    this.apiPath = apiOptions.apiPath;
    this.baseUrl = "https://" + manageEnv + ".symphonycommerce.com";
    if (apiOptions.basicAuth) {
        this.headers["Authorization"] = apiOptions.basicAuth;
        return;
    }
    if (apiOptions.email && apiOptions.password) {
        this.headers["Authorization"] = "Basic " + btoa2(apiOptions.email + ":" + apiOptions.password);
        return;
    }
    if (apiOptions.sessionId) {
        this.headers["Cookie"] = "SPSESSIONID=" + apiOptions.sessionId;
        return;
    }
    if (apiOptions.cookieAuth) {
        this.headers["Cookie"] = apiOptions.cookieAuth;
        return;
    }
};

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = APIBase;