///<reference path="../../typings/node/node.d.ts"/>
///<reference path="../../typings/es6-promise/es6-promise.d.ts"/>

import ServiceBase from './../bases/Service-Base';

const S3 = require('s3');

export default class S3Service extends ServiceBase {
    /* options = {
        bucket, key, accessKey, secretAccessKey
    } */

    constructor(private options) {
        super();
    }

    initS3 (file: any) {
        const options = this.options;
        const deferred = this.deferred();
        options.client = S3.createClient({
            maxAsyncS3: 20,
            s3RetryCount: 3,
            s3RetryDelay: 1000,
            multipartUploadThreshold: 20971520,
            multipartUploadSize: 15728640,
            s3Options: {
                accessKeyId: options.accessKeyId,
                secretAccessKey: options.secretAccessKey
            }
        });

        return deferred.resolve(options);
    }

    readFile (file: any) {}

    writeFile (file: any) {
        const params = {
            localFile: file.name,
            s3Params: {
                ACL: 'public-read',
                Bucket: this.options.bucket,
                Key: this.options.key
            },
            defaultContentType: file.name.split('.').pop()
        };

        return this.initS3(file).then((options) => {
            const deferred = this.deferred();
            const uploader = options.client.uploadFile(params);
            
            uploader
                .on('error', (err) => {
                    return deferred.reject(err);
                })
                .on('end', () => {
                    file.url = S3.getPublicUrlHttp(options.bucket, options.key);
                    return deferred.resolve(file);
                });
        });
    }
}