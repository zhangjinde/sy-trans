///<reference path="../../typings/node/node.d.ts"/>
///<reference path="../../typings/es6-promise/es6-promise.d.ts"/>

const _ = require('lodash');
const sendgrid = require('sendgrid');
const btoa = require('btoa');

export default class Email {
    
    sendgrid: any;

    constructor(private options) {
        this.sendgrid = sendgrid(options.sendgrid_key);
    }

    send ({ from, recipients, subject, body, attachments, fromName }) {   
        const request = this.sendgrid.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: { 
                from: {
                  email: from,
                  name: fromName || from
                },
                personalizations: [{
                  to: recipients
                }],
                subject: subject,
                content: [{ 
                  type: 'text/plain', 
                  value: body
                }],
                attachments: attachments.length ? _.map(attachments, (attachment) => {
                    return {
                      'content': btoa(attachment.content),
                      'content_id': attachment.id || '',
                      'disposition': 'inline',
                      'filename': attachment.filename
                    }
                }) : null
            }
        })

        return this.sendgrid.API(request);
    }
}