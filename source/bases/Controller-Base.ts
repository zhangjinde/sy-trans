///<reference path="../../typings/node/node.d.ts"/>
///<reference path="Controller-Options.ts"/>
///<reference path="Router-Options.ts"/>
///<reference path="Endpoint-Params.ts"/>
import services from '../services/service-config';

let _ = require(`lodash`);
let express = require(`express`);

export default class ControllerBase implements ControllerOptions {
  router: any;
  urlParams: any;
  queryParams: any;
  bodyParams: any;

  constructor(routerOptions: RouterOptions) {
      this.router = express.Router({
        mergeParams: true
      });

      this.urlParams = routerOptions.urlParams;
      this.queryParams = routerOptions.queryParams;
      this.bodyParams = routerOptions.bodyParams;

      if (!routerOptions || !routerOptions.middleware) {
          return;
      }

      _.each(routerOptions.middleware, this.router.use.bind(this));
  }

  private getArgs(params, routerParams, reqData) {
    if ((!params && !routerParams) || !reqData) {
      return {}
    }

    params = _.union(params, routerParams);
    return _.zipObject(params, _.map(params, (param) => {
      if (!reqData[param]) {
        return;
      }

      return reqData[param];
    }));
  }

  private retrieveApiCache(cacheKey: string, cacheDuration: number, bustCache?: any) {
    bustCache = typeof bustCache === 'string' ? bustCache === 'true' : bustCache;
    if (bustCache || !cacheDuration || !cacheKey || !services.redis) {
      return Promise.resolve();
    }

    return services.redis.get(cacheKey).then((cacheResult) => {
      try {
        cacheResult = JSON.parse(cacheResult);
      } catch (ex) {
        console.error("cache error: ", ex);
      }

      return Promise.resolve(cacheResult);
    });
  }

  private saveApiCache(cacheKey: string, cacheDuration: number, response: any, statusCode: number) {
    const thisCache = JSON.stringify({
      statusCode: statusCode,
      body: response
    });

    return services.redis.set(cacheKey, thisCache)
      .then((saveOk) => {
        services.redis.expire(cacheKey, cacheDuration);
        return Promise.resolve({
          saveOk: saveOk,
          response: response
        })
      });
  }

  createPath(params: EndpointParams) {
    const me = this,
          cache = params.cache || {};

    function returnCallback(req, res) {
      const origin = req.headers.origin,
            callback = params.callback,
            bodyParams = me.getArgs(params.bodyParams, params.bodyParams, req.body),
            queryParams = me.getArgs(params.queryParams, me.queryParams, req.query),
            urlParams = me.getArgs(params.urlParams, me.urlParams, req.params);

      let finalParams = _.assign({}, queryParams, urlParams, bodyParams, req.permissions);
      finalParams.env = finalParams.env || 
          _.includes(origin, "-release") ? "manage-release" : 
          _.includes(origin, "-sites") ? origin.split("-")[0] + "-partner" : 
          "manage";

      const cacheKey = _.map(cache.keys, (key, index) => {
        return finalParams[key];
      }).join("-");

      me.retrieveApiCache(cacheKey, cache.duration, req.query.bustCache)
      .then((cacheResult) => {
        if (!req.query.bustCache && !_.isEmpty(cacheResult) && cacheResult.statusCode) {
          return res.status(cacheResult.statusCode).send(cacheResult.body);
        }

        params.callback(finalParams).then((response) => {
          if (!params.cache) {
            res.send(response);
            return;
          }

          return me.saveApiCache(cacheKey, cache.duration, response, res.statusCode);
        })
          .then((cacheOk) => {
            res.send(cacheOk.response);
          }, (reject) => {
            res.status(500).send(reject);
          });
      }, (fail) => {
        console.error(fail);
      });
    }

    if (params.middleware) {
      return me.router[params.type](params.path, ...params.middleware, returnCallback);
    }

    return me.router[params.type](params.path, returnCallback);
  }
}
