///<reference path="../../typings/node/node.d.ts"/>
///<reference path="Controller-Options.ts"/>
///<reference path="Router-Options.ts"/>
///<reference path="Endpoint-Params.ts"/>

const _ = require(`lodash`);
const express = require(`express`);

export default class ControllerBase implements ControllerOptions {
  router: any;

  constructor(routerOptions: RouterOptions) {
    this.router = express.Router();
    if (!routerOptions || !routerOptions.middleware) {
      return;  
    }

    this.applyMiddleware(routerOptions.middleware);
  }

  private applyMiddleware(thisMiddleware: any, routePath?: string) {
    const me = this;
    if (!thisMiddleware || _.isEmpty(thisMiddleware)) {
        return;
    }

    _.each(thisMiddleware, function(middleware) {
      routePath ?
        me.router.use(routePath, middleware) :
        me.router.use(middleware);
    });
  }

  createPath(params: EndpointParams) {
    this.applyMiddleware(params.middleware, params.path);
    this.router[params.type](params.path, params.callback);
  }
}
