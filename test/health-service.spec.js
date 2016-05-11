const chai = require('chai');
const should = chai.should();
const _ = require('lodash');
const config = require('./test-config');
import HealthService from '../app/services/health-service';

describe('HealthService', () => {
  let healthService;

  beforeEach(() => {
    healthService = new HealthService();
  });

  // Do something
  it('doThings should do things', (done) => {
    healthService.getReport()
      .then((report) => {
        report.should.have.property('healthy');
        done();
      });
  });
});