import services from '../services/service-config';

export default class ServiceBase {
  services: any;

  constructor() {
    this.services = services;
    this.deferred = function() {
    	var d = {};
    	d.promise = new Promise((resolve, reject) => {
    		d.resolve = resolve;
    		d.reject = reject;
    	});

    	return d;
    };
  }
}
