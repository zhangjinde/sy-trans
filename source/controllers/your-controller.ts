///<reference path='../bases/Router-Options.ts'/>

import ControllerBase from '../bases/Controller-Base';
import YourService from '../services/your-service';
const yourService = new YourService();
const managePermissions = require('symphony-api').managePermissions;
const verifyHttps = require('symphony-api').verifyHttps;

export default class EasypostController extends ControllerBase {
  routerPath: string;
  routerOptions: RouterOptions;

  constructor() {
    this.routerPath = '/';
    this.routerOptions = {};

    super(this.routerOptions);
  }

  register() {
    this.createPath({
      type: 'get',
      path: '/',
      callback: (req, res) => {
        res.send('hello world');
      }
    });

  	this.createPath({
      type: 'post',
  		path: '/:site/do-things',
      middleware: [managePermissions],
      callback: (req, res) => {
        yourService.doThings({
          body: req.body
        })
          .then((result) => {
            res.send(result);
          }).catch((err) => {
            res.send({
              error: err
            })
          });
  		}
  	});

    return this.router;
  }
}