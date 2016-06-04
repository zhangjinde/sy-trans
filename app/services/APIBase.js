///<reference path="../../typings/node/node.d.ts"/>
///<reference path="../interfaces/ApiOptions.ts"/>
///<reference path="../interfaces/ApiHeaders.ts"/>
"use strict";
var btoa2 = require("btoa");
var APIBase = (function () {
    function APIBase(apiOptions) {
        // super();
        var manageEnv = apiOptions.env || "manage";
        this.headers = {
            "Accept": "application/json",
            "Content-Type": "application/json"
        };
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
    }
    return APIBase;
}());
exports.__esModule = true;
exports["default"] = APIBase;
