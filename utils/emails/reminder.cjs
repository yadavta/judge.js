/*
 * Copyright (C) 2021 Tanush Yadav <tanushyadav@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 * 
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