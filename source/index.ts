import FTP from './services/FTP';
import SFTP from './services/SFTP';

module.exports = initModule;
export default initModule;

function initModule(options: any) {

  const ftp = new FTP(options);
  const sftp = new SFTP(options);

  return {
    ftp, sftp
  }
}