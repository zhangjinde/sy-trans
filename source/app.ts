const express = require('express');
const bodyParser = require('body-parser');
const logfmt = require('logfmt');
const https = require('https');
const fs = require('fs');
const allowOrigins = require('symphony-api').allowOrigins;

import YourController from './controllers/your-controller';
const yourController = new YourController();
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));
app.use(logfmt.requestLogger());

app.use(allowOrigins([
  undefined,
  'chrome-extension://fdmmgilgnpjigdojojpjoooidkmcomcm',
  'https://manage.symphonycommerce.com'
]));

try {
  app.use(yourController.routerPath, yourController.register());
} catch(ex) {
  console.error(ex);
}

(() => {
  
  /*

    run this command to generate pem files
    openssl req -nodes -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365

  */

  const port = Number(process.env.PORT || 5000);
  if (process.env.NODE_ENV === "development") {
    https.createServer({
      key: fs.readFileSync(__dirname + '/../key.pem'),
      cert: fs.readFileSync(__dirname + '/../cert.pem')
    }, app).listen(port, function() {
      console.log("Listening secure on " + port);
    });

    return;
  } 

  app.listen(port, function() {
    console.log("Listening on " + port);
  });
})();


