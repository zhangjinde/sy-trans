///<reference path="../../typings/node/node.d.ts"/>
const _ = require("lodash"),
      symphonyApi = require("symphony-api"),
      appConfig = require('../config/app'),
      redis = require("promise-redis")(),
      logger = require('winston').add(require('winston-graylog2'), {
      	name: 'Graylog',
      	silent: false,
      	handleExceptions: true,
      	debugStdout: false,
      	graylog: {
      	  	servers: [{ 
        			host: 'graylog.symphonycommerce.com', 
          		port: 12201 
          	}],
          	facility: 'client-eng',
            hostname: appConfig.applicationName
        	}
      });

if (process.env.NODE_ENV === 'development') {
	logger.level = 'debug';
	logger.debugStdout = true;
}

const serviceConfig = (() => {
  if (process.env.NODE_ENV === 'development') {
    return {
      db: symphonyApi.db("Local", {
        user: "root",
        password: "passw0rd",
        database: "clienteng"
      }),
      redis: redis.createClient()
    }
  }

  return {
    db: symphonyApi.db("Client", {
      user: process.env.DB_CLIENT_USER,
      password: process.env.DB_PASSWORD,
      database: "clienteng"
    }),
    redis: redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST)
      .auth(process.env.REDIS_AUTH.split(":")[1])
  }
})();

export default _.extend(serviceConfig, {
  logger: logger
});
