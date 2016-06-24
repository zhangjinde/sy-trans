const chai = require('chai');
const should = chai.should();
const _ = require('lodash');
const config = require('./test-config');
import SFTPService from '../app/services/SFTP';

describe('SFTP Service', () => {
    let sftpService;

    beforeEach(() => {
        sftpService = new SFTPService();
    });

});