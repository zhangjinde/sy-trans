///<reference path="../../typings/node/node.d.ts"/>
///<reference path="../../typings/es6-promise/es6-promise.d.ts"/>

const _ = require('lodash');
const sendgrid = require('sendgrid');
import ServiceBase from './../bases/Service-Base';

export default class Email extends ServiceBase {
    
    sendgrid: any;

    constructor(private options) {
        super();
        this.sendgrid = sendgrid(options.sendgrid_key);
    }

    send ({ from, recipients, subject, body, attachments }) {   
        const deferred = this.deferred();
        const request = this.sendgrid.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: { 
                from: {
                  email: from || "do-not-reply@symphonycommerce.com",
                  name: "Symphony Commerce <DO NOT REPLY>"
                },
                personalizations: [{
                  to: recipients,
                  subject: subject
                }],
                content: [{ 
                  type: 'text/plain', 
                  value: body
                }],
                attachments: attachments ? _.map(attachments, (attachment) => {
                    return [{
                      "content": btoa('This is a test.'),
                      "content_id": 'ID',
                      "disposition": "inline",
                      "filename": `hi.txt`
                    }]
                }) : null
            }
        })

        this.sendgrid.API(request)
            .then(response => {
                deferred.resolve(response);
            })
            .catch(deferred.reject);

        return deferred.promise;
    }
}