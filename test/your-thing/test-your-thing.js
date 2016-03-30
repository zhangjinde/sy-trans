const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const expect = require('chai').expect;
const _ = require('lodash');
const config = require('../test-config');
chai.use(chaiHttp);


describe('Your Thing', function() {
  // Default time to wait for response is 2 seconds for async methods, too short
  var app;

  before(function () {
    app = require('../../app/app');
  });

  after(function (done) {
    app.close();
    done();
  });

  // Create feed
  it('should return "hello world" on /site/things/ GET', function(done) {
    chai.request(app)
      .get('/site/things')
      .query({
        'email': config.EMAIL,
        'password': config.PASSWORD,
        'site': config.SITE
      })
      .end(function(err, res){
        res.should.have.status(200);
        res.text.should.be.equal('hello world');
        done();
      });
  });
});