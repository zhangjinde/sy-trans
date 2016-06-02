///<reference path="../../typings/node/node.d.ts"/>
///<reference path="../interfaces/ApiOptions.ts"/>
///<reference path="../interfaces/ApiHeaders.ts"/>


import ServiceBase from './../bases/Service-Base';
const btoa2 = require(`btoa`);

export default class APIBase implements ApiOptions {

  env: string;
  headers: ApiHeaders;
  baseUrl: string;
  logger: any;

  constructor(apiOptions: ApiOptions) {
    // super();
    let manageEnv = apiOptions.env || `manage`;
    this.headers = {
      "Accept": `application/json`,
      "Content-Type": `application/json`
    };

    this.logger = apiOptions.logger ? apiOptions.logger : console;
    this.apiPath = apiOptions.apiPath;
    this.baseUrl = `https://${manageEnv}.symphonycommerce.com`;

    if (apiOptions.basicAuth) {
      this.headers[`Authorization`] = apiOptions.basicAuth;
      return;
    }

    if (apiOptions.email && apiOptions.password) {
      this.headers[`Authorization`] = `Basic ` + btoa2(apiOptions.email + `:` + apiOptions.password);
      return;
    }

    if (apiOptions.sessionId) {
      this.headers[`Cookie`] = `SPSESSIONID=${apiOptions.sessionId}`;
      return;
    } 

    if (apiOptions.cookieAuth) {
      this.headers[`Cookie`] = apiOptions.cookieAuth;
      return;
    }
  }

}