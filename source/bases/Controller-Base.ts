///<reference path="../../typings/node/node.d.ts"/>
///<reference path="Controller-Options.ts"/>
///<reference path="Router-Options.ts"/>
///<reference path="Endpoint-Params.ts"/>

let _ = require(`lodash`);
let express = require(`express`);

export default class ControllerBase implements ControllerOptions {
    router: any;

    constructor(routerOptions: RouterOptions) {
        this.router = express.Router();

        if (!routerOptions || !routerOptions.middlewares) {
            return;
        }

        this.applyMiddlewares(routerOptions.middlewares);
    }

    private applyMiddlewares(theseMiddlewares: any) {
        let me = this;
        if (!theseMiddlewares || _.isEmpty(theseMiddlewares)) {
            return;
        }

        _.each(theseMiddlewares, function(thisMiddlware) {
            me.router.use(thisMiddlware);
        });
    }

    private getArgs(params, reqData) {
        if (!params || !reqData) {
            return {}
        }

        return _(params).map((param) => {
            if (!reqData[param]) {
                return;
            }
            return [param, reqData[param]];
        }).compact().zipObject().value();
    }

    createPath(params: EndpointParams) {
        const me = this;
        me.applyMiddlewares(params.middlewares);
        me.router[params.type](params.path, (req, res) => {
            const bodyParams = me.getArgs(params.bodyParams, req.body);
            const queryParams = me.getArgs(params.queryParams, req.query);
            const urlParams = me.getArgs(params.urlParams, req.params);
            const finalParams = _.assign({}, queryParams, urlParams, bodyParams);

            params.callback(finalParams)
                .then((result) => {
                    res.send(result);
                }, (reject) => {
                    res.status(500).send(reject);
                });

        });
    }
}
