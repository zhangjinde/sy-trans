import services from '../services/service-config';

export default class ServiceBase {
  services: any;

  constructor() {
    this.services = services;
  }
}
