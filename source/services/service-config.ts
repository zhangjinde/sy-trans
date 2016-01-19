///<reference path="../../typings/node/node.d.ts"/>

const easypost = require('node-easypost')(process.env.EASYPOST_APIKEY);
const logger = require('winston').add(require('winston-graylog2'), {
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
    	hostname: process.env.APP_NAME
  	}
});

if (process.env.NODE_ENV === 'development') {
	logger.level = 'debug';
	logger.debugStdout = true;
}

export default {
	logger: logger,
	easypost: easypost
}
