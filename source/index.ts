const _ = require('lodash');
const bulkRequire = require("bulk-require");

module.exports = initModule;
export default initModule;

function initModule(apiOptions: any = {}) {
  const apiClasses = bulkRequire(`${__dirname}/services`, [
    "SFTP.js", "FTP.js"
  ]);

  _.each(apiClasses, (apiClass, apiName) => {
    if (_.isEmpty(apiOptions)) {
      apiClasses[apiName] = apiClass.default;
      return;
    }

    apiClasses[apiName] = new apiClass.default(_.clone(apiOptions, true));
  });

  return apiClasses;
}