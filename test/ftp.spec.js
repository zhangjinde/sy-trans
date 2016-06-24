const chai = require('chai');
const should = chai.should();
const _ = require('lodash');
const config = require('./test-config');
import FTPService from '../app/services/FTP';

describe('FTP Service', () => {
    let ftpService;

    beforeEach(() => {
        ftpService = new FTPService();
    });

});