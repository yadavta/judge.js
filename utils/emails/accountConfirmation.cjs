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

let AWS = require('aws-sdk');
const User = require('../models/User');
const EmailConfirmation = require('../models/EmailConfirmation');

async function sendConfirmationEmail(recipientEmail, recipientName, tokenURI) {

  let params = {
    Destination: {
      ToAddresses: [recipientEmail]
    },
    Source: 'accounts@tanushyadav.me',
    Template: 'ConfirmationEmail',
    TemplateData: '{\"userName\": \"' + recipientName + '\", \"confirmationLink\": \"' + tokenURI + '\"}'
  }

  let sendPromise = new AWS.SES({apiVersion: '2010-12-01', region:'us-west-2'}).sendTemplatedEmail(params).promise();
  sendPromise.then(data => {
    //return(true);
    console.log(params);
    console.log(data);
  }).catch(err => {
    //return(false);
    console.log(err);
  })

  console.log("hm");

}

exports.confirmationEmail = sendConfirmationEmail;