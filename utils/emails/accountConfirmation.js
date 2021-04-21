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