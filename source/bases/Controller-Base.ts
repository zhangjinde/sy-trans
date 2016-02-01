///<reference path="../../typings/node/node.d.ts"/>
///<reference path="Controller-Options.ts"/>
///<reference path="Router-Options.ts"/>
///<reference path="Endpoint-Params.ts"/>

const _ = require(`lodash`);
const express = require(`express`);

export default class ControllerBase implements ControllerOptions {
    router: any;

    constructor(routerOptions: RouterOptions) {
        let me = this;
        me.router = express.Router({
            mergeParams: true
        });

        if (!routerOptions || !routerOptions.middleware) {
            return;
        }

        _.each(routerOptions.middleware, (middleware) => {
            me.router.use(middleware);
        });
    }

    createPath(params: EndpointParams) {
        if (params.middleware) {
            return this.router[params.type](params.path, ...params.middleware, params.callback);
        }

        return this.router[params.type](params.path, params.callback);
    }
}
