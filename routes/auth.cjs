/* Copyright (C) 2021 Tanush Yadav <tanushyadav@gmail.com>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

//npm imports
const router = require('express').Router();
const cookieParser = require('cookie-parser');
const cryptoRandomString = require('crypto-random-string');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const env = require('dotenv');

//datetime
var dayjs = require('dayjs');
var isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
dayjs.extend(isSameOrBefore);

//exports from other bits of code
const User = require('../utils/models/User');
const Session = require('../utils/models/Session');
const EmailConfirmation = require('../utils/models/EmailConfirmation');
const Confirmations = require('../utils/emails/accountConfirmation.cjs');
const siteDomain = "https://interlakesharks.org";

//validation function
const joiUserSchema = Joi.object({
  firstName: Joi.string().alphanum().min(1).max(100).required(),
  lastName: Joi.string().alphanum().min(1).max(100).required(),
  email: Joi.string().email().min(3).required(),
  password: Joi.string().min(8).required(),
  group: Joi.string().required(),
});

router.post('/register', async (req, res) => {

  const joiValidation = joiUserSchema.validate(req.body);
  console.log(joiValidation);

  //if there's an error, send that to client
  if (joiValidation.hasOwnProperty("error")) {
    console.log(joiValidation.error);
    res.status(400).send(joiValidation.error.details[0].message);
  }
  else {

    //search for duplicate user
    try {
      let duplicateUser = await User.findOne({ email: req.body.email }).exec();

      if (!(duplicateUser === null)) {
        res.status(401).send("Error: User with this email already exists");
      } else { //otherwise sign user up 
        // hash password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);

        // make user object following schema described in ~/utils/models/User.js
        const user = new User({
          fullName: req.body.fullName,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          studentId: req.body.studentId,
          password: hashedPassword,
          emailConfirmed: false,
          approved: false,
          group: req.body.group
        });

        try {
          const savedUser = await user.save();
          res.status(200).send("User Registered Successfully");
        } catch (err) {
          console.log(err);
          res.status(500).send("Error: Unable to save user to database");
        }
      }

    } catch (err) { // if duplicate user search failed, throw error
      console.log(err);
      res.status(500).send("Error: Unable to check database for duplicate users");
    }

  }

});

//endpoint for user to login
router.post('/login', async (req, res) => {
  console.log("login request received");
  // search mongo for user with existing email
  try {
    let currentUser = await User.findOne({ email: req.body.email }).exec();
    //if no user found with same email pass error to client
    if (currentUser === null) {
      res.status(401).send("Error: Invalid Email or Password");
    }
    //otherwise, use bcrypt to check client-password with db-stored password
    else {
      console.log("Checking password");
      let bcryptResult = bcrypt.compareSync(req.body.password, currentUser.password);
      if (bcryptResult === true) {

        if (!currentUser.emailConfirmed) {

          let emailConfirmationCurrentStatus = "";
          EmailConfirmation.findOne({ userId: currentUser._id }, function (err, results) {
            if (err) {
              res.status(500).send("Error: database issues");
            } else if (results === null) {
              let newToken = cryptoRandomString({ length: 32, type: 'url-safe' });

              async function addNewEmailConfirmation() {
                let newEmailConfirmation = new EmailConfirmation({
                  userId: currentUser._id,
                  confirmationToken: newToken,
                  expires: dayjs(new Date()).add(15, 'minute').toDate()
                });

                const savedEmailConfirmation = await newEmailConfirmation.save();

                console.log(savedEmailConfirmation);
                console.log("email saved to mongo");

                let confirmationEmailSent = await Confirmations.confirmationEmail(currentUser.email, currentUser.firstName, ("https://interlakesharks.org" + '/auth/confirmEmail/' + currentUser._id + '/' + newToken));

              }

              addNewEmailConfirmation();

              //send email
              //make more informative error code
            } else {
              console.log("doing the email confirmation shit");
              async function updateEmailConfirmation() {
                let updatedToken = cryptoRandomString({ length: 32, type: 'url-safe' });
                let updatedConfirmation = await EmailConfirmation.findOneAndUpdate({ _id: results._id }, { confirmationToken: updatedToken, expires: dayjs(new Date()).add(20, 'minute').toDate() });
                console.log(currentUser);
                let confirmationEmailSent = await Confirmations.confirmationEmail(currentUser.email, currentUser.firstName, ("https://interlakesharks.org" + '/auth/confirmEmail/' + currentUser._id + '/' + updatedToken));

              }

              updateEmailConfirmation().then(err => console.log(err));

            }
          });

          res.status(403).send("Error: Please confirm your email");
        }
        else {//if the password is correct, create a new session token
          console.log("correct pw");
          newSessionToken = cryptoRandomString({ length: 60, type: 'url-safe' });
          let sessionTempJS = ({
            valid: true,
            token: newSessionToken,
            userId: currentUser._id,
            expires: dayjs().add(14, 'day').toDate()
          });

          console.log("tryna add to mongo");
          //try to add the session token to mongo
          await Session.findOneAndReplace({ userId: currentUser._id }, sessionTempJS, { new: true }, function (err, result) {
            if (err) {
              console.log("error " + err);
              res.status(501).send("Error: Sessions Inaccessible");
            }
            else if (result === null) {
              console.log("no session");
              const sessionTemp = new Session(sessionTempJS);
              async function hhh() {
                const newSession = await sessionTemp.save();
              }
              hhh();
              console.log("entirely new session created");
              res.cookie('sessionToken', newSessionToken, { expires: new Date(Date.now() + 999999999) }).send(200);
            }
            else {
              console.log("session exists lets go");
              res.cookie('sessionToken', newSessionToken, { expires: new Date(Date.now() + 999999999) }).send(200);
            }
          });
        }

      } else {
        // inform of wrong email/pw
        console.log("wrong pw");
        res.status(401).send("Error: Invalid Email or Password");
      }
    }
    // catch error if mongo fails
  } catch (err) {
    console.log(err);
    res.status(501).send("Error: database issues");
  }

})

router.get('/confirmEmail/:userId/:token', async (req, res) => {

  let attemptedUserId = req.params.userId;
  let attemptedToken = req.params.token;

  //console.log(req.params);

  EmailConfirmation.findOne({ userId: attemptedUserId }, function (err, result) {
    console.log("ree")
    if (err) {
      console.log("error")
      res.status(500).send("Error: database issues");
    } else if (attemptedToken === result.confirmationToken) {

      if (dayjs().isSameOrBefore(dayjs(result.expires))) {

        async function changeUser() {
          let updatedUser = await User.findOneAndUpdate({ _id: attemptedUserId }, { emailConfirmed: true }, { new: true });
        }

        changeUser();

        res.redirect('/login');
      }

    } else {
      res.status(400).send("Error: invalid token");
    }
  });


});

module.exports = router;