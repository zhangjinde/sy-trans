import FTP from './services/FTP';
import SFTP from './services/SFTP';
import Email from './services/Email';

module.exports = initModule;
export default initModule;

function initModule(options: any) {

  const ftp = new FTP(options);
  const sftp = new SFTP(options);
  const email = new Email(options);

  return {
    ftp, sftp, email
  }
}