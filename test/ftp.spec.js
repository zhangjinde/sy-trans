import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chai, { expect } from 'chai';

const should = chai.should();
const _ = require('lodash');
const config = require('./test-config');
import FTPService from '../app/services/FTP';

const sandbox = sinon.sandbox.create();

const mockOptions = {
    username: 'fakeuser'
}

const mockList = [
    {
        file: 'first'
    },
    {
        file: 'second'
    }
]

const mockFile = 'File contents.'

function mockFtp() {
    return Promise.resolve({
        list: (path, callback) => {
            if (!path) {
                callback('missing directory path');
            }

            callback(null, mockList);
        },
        file: (file, callback) => {
            if (!file.path) {
                callback('missing file path');
            }

            callback(null, mockFile);
        }
    });
}

chai.use(sinonChai);
sandbox.stub(FTPService.prototype, 'initFTP').returns(mockFtp());

describe('FTP Service', () => {
    let ftpService;

    beforeEach(() => {
        ftpService = new FTPService(mockOptions); 
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should return a list', (done) => {    
        ftpService.readDir('path/to/directory').then((list) => {
            expect(list).to.deep.equal(mockList);
            done();
        });
    });

    it('should return a file object', (done) => {
        ftpService.readFile({ content: null, path: 'path/to/file' }).then((contents) => {
            expect(contents).to.deep.equal(mockFile);
            done();
        });
    }); 
});












