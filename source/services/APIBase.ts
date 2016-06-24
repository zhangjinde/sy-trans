///<reference path="../../typings/node/node.d.ts"/>
///<reference path="../interfaces/ApiOptions.ts"/>
///<reference path="../interfaces/ApiHeaders.ts"/>


import ServiceBase from './../bases/Service-Base';
const btoa2 = require(`btoa`);

export default class APIBase extends ServiceBase implements ApiOptions {

    env: string;
    headers: ApiHeaders;
    baseUrl: string;
    logger: any;

    constructor(apiOptions: ApiOptions) {
        super();
        let manageEnv = apiOptions.env || `manage`;
        this.headers = {
            "Accept": `application/json`,
            "Content-Type": `application/json`
        };

    }

}