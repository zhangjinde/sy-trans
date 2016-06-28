import sinon from "sinon";
import sinonChai from "sinon-chai";
import chai, { expect } from "chai";

const should = chai.should();
const _ = require('lodash');
const config = require('./test-config');
import FTPService from '../app/services/FTP';

const sandbox = sinon.sandbox.create();

const mockOptions = {
    username: "fakeuser"
}

const mockList = [{
    file: "first"
},{
    file: "second"
}]

function mockFtp() {
    return Promise.resolve({
        list: (path, callback) => {
            if (!path) {
                callback("missing path");
            }

            callback(null, mockList);
        }
    });
}

chai.use(sinonChai);
sandbox.stub(FTPService.prototype, "initFtp").returns(mockFtp());

describe('FTP Service', () => {
    let ftpService;

    beforeEach(() => {
        ftpService = new FTPService(mockOptions); 
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should return a list', (done) => {    
        ftpService.readDir("some path").then((list) => {
            expect(list).to.deep.equal(mockList);
            done();
        });
    });
});