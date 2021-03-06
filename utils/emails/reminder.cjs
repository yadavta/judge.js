/* Copyright (C) 2021 Tanush Yadav <tanushyadav@gmail.com>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

//for templates, use CLI: aws ses create-template --cli-input-json file://{filepath}
// to update, use CLI: aws ses update-template --cli-input-json file://{filepath}
//to get template, use CLI: aws ses get-template --template-name {{TemplateName}}
let AWS = require('aws-sdk');
var dayjs = require('dayjs');
var relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

async function sendFeeReminderEmail(recs,tournamentName,cleanFeeDueDate) {
 
  let params = {
    Destination: {
      BccAddresses: recs
    },
    Source: 'payments@tanushyadav.me',
    Template: 'FeeReminder',
    TemplateData: '{\"userName\": \"Student\", \"tournamentName\": \"' + tournamentName + '\", \"cleanFeeDueDate\": \"' + cleanFeeDueDate + '\"}'
  }
  
  let sendPromise = new AWS.SES({apiVersion: '2010-12-01', region:'us-west-2'}).sendTemplatedEmail(params).promise();
  sendPromise.then(data => {
    console.log("success");
    console.log(data);
    return(data);
  }).catch(err => {
    console.log("error");
    console.log(err);
    return(err);
  })
}

exports.fees = sendFeeReminderEmail;