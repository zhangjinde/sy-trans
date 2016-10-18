///<reference path="../../typings/node/node.d.ts"/>
///<reference path="../../typings/es6-promise/es6-promise.d.ts"/>

const _ = require('lodash');
const sendgrid = require('sendgrid');
import ServiceBase from './../bases/Service-Base';

export default class Email extends ServiceBase {
    
    sendgrid: any;

    constructor(private options) {
        super();
        this.sendgrid = sendgrid
                            .SendGrid(options.sendgrid_key);
    }

    send ({ from, recipients, subject, body, attachments }) {   
        const deferred = this.deferred();
        this.sendgrid.API({
          method: 'POST',
          path: '/v3/mail/send',
          body: { 
            from: {
              email: from || "do-not-reply@symphonycommerce.com",
              name: "Symphony Commerce <DO NOT REPLY>"
            },
            personalizations: [{
              to: _.map(recipients.split(','), (email) => { 
                return { email, name: email } 
              })
            }],
            subject: subject,
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
        }, deferred.resolve);
        return deferred.promise;
    }
}