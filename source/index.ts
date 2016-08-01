import FTP from './services/FTP';
import SFTP from './services/SFTP';
import S3 from './services/S3';

module.exports = initModule;
export default initModule;

function initModule(options: any) {

  const ftp = new FTP(options);
  const sftp = new SFTP(options);
  const s3 = new S3(options);

  return {
    ftp, sftp, s3
  }
}