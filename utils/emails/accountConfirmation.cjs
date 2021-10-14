/* Copyright (C) 2021 Tanush Yadav <tanushyadav@gmail.com>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const User = require('../models/User');
const EmailConfirmation = require('../models/EmailConfirmation');

async function sendConfirmationEmail(recipientEmail, recipientName, tokenURI) {

  let mailgun = require('mailgun-js')({ apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN });

  const data = {
    from: `Interlake Speech & Debate <accounts@${process.env.MAILGUN_DOMAIN}>`,
    to: recipientEmail,
    subject: "Interlake Sharks Account Confirmation",
    html: `<p style=\"color:black\"> Dear ${recipientName}, <br><br> Please navigate to the following link in your browser to confirm your email: ${tokenURI}</p>`,
    text: `Dear ${recipientName} \nPlease navigate to the following link in your browser to confirm your email: ${tokenURI}`
  };

  mailgun.messages().send(data, (error, body) => {
    console.log(body);
  });

}

exports.confirmationEmail = sendConfirmationEmail;