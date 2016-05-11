const chai = require('chai');
const should = chai.should();
const _ = require('lodash');
const config = require('./test-config');
import YourService from '../app/services/your-service';

describe('YourService', () => {
  let yourService;

  beforeEach(() => {
    yourService = new YourService();
  });

  // Do something
  it('doThings should do things', (done) => {
    yourService.doThings({
      jobs: [1, 2]
    })
    .then((data) => {
      data.should.be.a('array').with.length(2);
      done();
    });
  });
});