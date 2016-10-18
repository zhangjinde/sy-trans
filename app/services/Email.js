///<reference path="../../typings/node/node.d.ts"/>
///<reference path="../../typings/es6-promise/es6-promise.d.ts"/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require('lodash');
var sendgrid = require('sendgrid');
var Service_Base_1 = require('./../bases/Service-Base');
var Email = (function (_super) {
    __extends(Email, _super);
    function Email(options) {
        _super.call(this);
        this.options = options;
        this.sendgrid = sendgrid
            .SendGrid(options.sendgrid_key);
    }
    Email.prototype.send = function (_a) {
        var from = _a.from, recipients = _a.recipients, subject = _a.subject, body = _a.body, attachments = _a.attachments;
        var deferred = this.deferred();
        this.sendgrid.API({
            method: 'POST',
            path: '/v3/mail/send',
            body: {
                from: {
                    email: from || "do-not-reply@symphonycommerce.com",
                    name: "Symphony Commerce <DO NOT REPLY>"
                },
                personalizations: [{
                        to: _.map(recipients.split(','), function (email) {
                            return { email: email, name: email };
                        })
                    }],
                subject: subject,
                content: [{
                        type: 'text/plain',
                        value: body
                    }],
                attachments: attachments ? _.map(attachments, function (attachment) {
                    return [{
                            "content": btoa('This is a test.'),
                            "content_id": 'ID',
                            "disposition": "inline",
                            "filename": "hi.txt"
                        }];
                }) : null
            }
        }, deferred.resolve);
        return deferred.promise;
    };
    return Email;
}(Service_Base_1["default"]));
exports.__esModule = true;
exports["default"] = Email;
