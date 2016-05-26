"use strict";
var express = require('express');
var bodyParser = require('body-parser');
var logfmt = require('logfmt');
var https = require('https');
var fs = require('fs');
var allowOrigins = require('node-symphony').allowOrigins;
// const transferController = new TransferController();
// const healthController = new HealthController();
var app = express();
var server;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));
app.use(logfmt.requestLogger());
// app.use(allowOrigins([
//   undefined,
//   'https://manage.symphonycommerce.com',
//   'https://manage-release.symphonycommerce.com'
// ]));
app.use(allowOrigins(null));
process.on('uncaughtException', function (err) {
    console.log('Uncaught exception');
    console.error(err.stack);
    process.exit(1);
});
try {
    app.use(transferController.routerPath, transferController.register());
    app.use(healthController.routerPath, healthController.register());
}
catch (ex) {
    console.error(ex);
}
(function () {
    /*
  
      run this command to generate pem files
      openssl req -nodes -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365
  
    */
    var port = Number(process.env.PORT || 5000);
    if (process.env.NODE_ENV == "development") {
        server = https.createServer({
            key: fs.readFileSync(__dirname + '/../key.pem'),
            cert: fs.readFileSync(__dirname + '/../cert.pem')
        }, app).listen(port, function () {
            console.log('https listening');
            console.log("Listening secure on " + port);
        });
    }
    else {
        server = app.listen(port, function () {
            console.log('regular listening');
            console.log("Listening on " + port);
        });
    }
})();
module.exports = server;
