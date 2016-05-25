import ServiceBase from './../bases/Service-Base';
const btoa2 = require(`btoa`);

export default class APIBase extends ServiceBase {

  logger: any;

  constructor() {
    super();

    this.logger = this.services.logger;
  }
}