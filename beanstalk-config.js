var aws = {};
//aws = require('./aws.json');

module.exports = {
  accessKeyId: process.env.AWS_ACCESSKEY || aws.AWS_ACCESSKEY,  // optional
  secretAccessKey: process.env.AWS_SECRETKEY || aws.AWS_SECRETKEY,  // optional
  region: 'US West (Oregon)',
  appName: 'symphony-easypost',

  solutionStack: '64bit Amazon Linux 2015.09 v2.0.6 running Node.js'/*,
   template: 'myEnvironmentTemplate',

  environmentSettings: [
    {
      Namespace: 'aws:autoscaling:launchconfiguration',
      OptionName: 'IamInstanceProfile',
      Value: 'ElasticBeanstalkProfile'
    },
    // ...
  ],
  environmentTags: [ // optional
    {
      key: 'foo',
      value: 'bar'
    },
    // ...
  ],
  bucketConfig: { // optional - passed into S3.createBucket()
    Bucket: 'mys3bucket', // optional, else will attempt to use appName
    // ...
  },
  bucketTags: [ // optional
    {
      key: 'foo',
      value: 'bar'
    },
    // ...
  ]*/
}