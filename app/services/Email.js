///<reference path="../../typings/node/node.d.ts"/>
///<reference path="../../typings/es6-promise/es6-promise.d.ts"/>
"use strict";
var _ = require('lodash');
var sendgrid = require('sendgrid');
var Email = (function () {
    function Email(options) {
        this.options = options;
        this.sendgrid = sendgrid(options.sendgrid_key);
    }
    Email.prototype.send = function (_a) {
        var from = _a.from, recipients = _a.recipients, subject = _a.subject, body = _a.body, attachments = _a.attachments, fromName = _a.fromName;
        var request = this.sendgrid.emptyRequest({
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
                attachments: attachments.length ? _.map(attachments, function (attachment) {
                    return [{
                            'content': attachment.content,
                            'content_id': attachment.id || '',
                            'disposition': 'inline',
                            'filename': attachment.filename
                        }];
                }) : null
            }
        });
        return this.sendgrid.API(request);
    };
    return Email;
}());
exports.__esModule = true;
exports["default"] = Email;
