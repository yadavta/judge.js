/* Copyright (C) 2021 Tanush Yadav <tanushyadav@gmail.com>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const router = require('express').Router();
const cookieParser = require('cookie-parser');
var dayjs = require('dayjs')
const Session = require('../utils/models/Session.js');
const Blog = require('../utils/models/Blog.js');
const User = require('../utils/models/User.js');
const Entry = require('../utils/models/Entry');
const Tournament = require('../utils/models/Tournament');
const { WellArchitected } = require('aws-sdk');

router.use(async function isAuthenticated(req, res, next) {
  let providedToken = req.cookies.sessionToken;
  //console.log(providedToken);
  requestedURL = encodeURIComponent('/private' + req.url);
  //console.log(requestedURL);
  try {

    currentToken = await Session.findOne({ token: providedToken }).exec();

    if (currentToken === null) {
      res.redirect(('/login?redirect=' + requestedURL));
    } else {
      if (dayjs().isBefore(dayjs(currentToken.expires))) {
        res.locals.authenticated = true;
        res.locals.userId = currentToken.userId;

        await User.findOne({ _id: res.locals.userId }, 'fullName firstName lastName email').then(results => {
          if (results === null) {
            res.send(500);
          }
          res.locals.userName = results.fullName;
          res.locals.userFirstName = results.firstName;
          res.locals.userLastName = results.lastName;
          res.locals.userEmail = results.email;
          next();
        })
      }
      else {
        res.redirect('/login/' + requestedURL);
      }
    }

  } catch (err) {
    console.log(err);
    res.redirect('/login/' + requestedURL);
  }

});

router.get('/testing', (req, res) => {
  //console.log(res.locals.authenticated);
  res.render('../views/pages/privates/testing');
});

router.get('/homepage', (req, res) => {

  async function searchAndRender() {

    await Entry.find({ entryStudentId: res.locals.userId }, 'entryTournamentName entryEvent entryStatus', function (err, docs) {
      let entryTableHTML = ''

      docs.forEach((entry) => {
        tempHTML = `<tr><td>${entry.entryTournamentName}</td><td>${entry.entryEvent}</td><td>${entry.entryStatus}</td></tr>`
        entryTableHTML += tempHTML;
      });

      res.render('../views/pages/privates/homepage', {
        userInfo: {
          fullName: res.locals.userName
        },
        html: {
          entryTableHTML: entryTableHTML
        }
      });
    });

  }

  searchAndRender();

});

router.get('/create/blog', (req, res) => {
  res.render('../views/pages/privates/createPost');
})

router.get('/create/tournament', (req, res) => {
  res.render('../views/pages/privates/createTournament')
});

router.get('/create/entry', (req, res) => {
  Tournament.find({ internalSignupDeadline: { $gte: dayjs().add(1, 'd').format('YYYY-MM-DD') } }).select('tournamentName tournamentId').exec((err, docs) => {
    if (err) {
      res.send(500);
    } else {
      let tourneyOptionsHTML = "";
      for (tourney of docs) {
        tourneyOptionsHTML += `<option value="${tourney.tournamentId}">${tourney.tournamentName}</option>`;
      }
      res.render('../views/pages/privates/createEntry', { tournamentOptions: tourneyOptionsHTML });
    }
  });
});

router.get('/view/entry', (req, res) => {
  Tournament.find().select('tournamentName tournamentId').exec((err, docs) => {
    if (err) {
      res.send(500);
    } else {
      let tourneyOptionsHTML = "";
      for (tourney of docs) {
        tourneyOptionsHTML += `<option value="${tourney.tournamentId}">${tourney.tournamentName}</option>`;
      }
      res.render('../views/pages/privates/viewEntries', { tournamentOptions: tourneyOptionsHTML });
    }
  });
});

router.post('/blog/create', (req, res) => {

  async function createPost() {
    await User.findOne({ _id: res.locals.userId }, 'fullName').then(results => {
      if (results === null) {
        res.send(500);
      }
      else { // first, get the author's name

        let countedId;

        Blog.estimatedDocumentCount().then(docCount => { // second, get the estimated doc count to congiure id

          docCount++;
          countedId = docCount.toString();

          let newBlog = new Blog({
            _id: countedId,
            postTitle: req.body.postTitle,
            postContent: req.body.postContent,
            postImage: req.body.postImage,
            postImageAlt: req.body.postImageAlt,
            postAuthorName: results.fullName,
            postAuthorId: res.locals.userId,
            postDate: dayjs().format('YYYY-MM-DD HH:mm:ss')
          });

          async function savePost() {
            let savedBlog = await newBlog.save().catch(err => { // then save it!
              console.log("error in saving");
              console.log(err);
            });
            if (savedBlog === newBlog) {
              res.send(200);
            } else {
              res.send(500);
            }
          }

          savePost();

        }).catch(error => {
          console.log("error in estimating document count");
          console.log(error);
          res.send(500);
        })

      }
    }).catch(error => {
      console.log(error);
      res.send(500);
    });
  }

  createPost();

});

router.post('/entry/create', (req, res) => {

  async function createEntry() {
    let returnable;
    // proccess frontend data 

    const newEntry = new Entry({
      entryStudentId: res.locals.userId,
      entryStudentName: res.locals.userName,
      entryTournamentId: req.body.tournamentId,
      entryTournamentName: req.body.tournamentName,
      entryEvent: req.body.event,
      entryStatus: "requested",
      entryNotes: req.body.additionalNotes,
      entryApplicationDate: dayjs().toISOString()
    });
    // check for duplicates
    await Entry.findOne({ entryStudentId: newEntry.entryStudentId, entryTournamentId: newEntry.entryTournamentId, entryEvent: newEntry.entryEvent }, function (err, docs) {
      if (err == null) {
        if (docs == null) {

          async function saveEntry() {
            // save the new entry to DB if not duplicate
            await newEntry.save().then((savedEntry) => {
              if (savedEntry === newEntry) {
                returnable = "success";
              } else {
                returnable = "error";
              }
            }).catch(err => { // then save it!
              console.log("error in saving");
              console.log(err);
            });
          }

          saveEntry();

        } else {
          // otherwise handle error
          returnable = "duplicate";
        }
      } else {
        returnable = "error";
      }

    });
    if (returnable == undefined) {
    } else {
      return returnable;
    }
  }

  createEntry().then(rep => {
    res.send(rep);
  });

});


router.get('/tournament/create', (req, res) => {
  async function createTournament() { }
  /*const newTournament = new Tournament({
    "circuits": [
      "local",
      "national"
    ],
    "endDate": "2021-02-08",
    "location": "Stanford, CA",
    "schoolApproved": false,
    "slots": {
      "cx": 3,
      "ld": 1,
      "pf": 2
    },
    "startDate": "2021-02-06",
    "tabroomName": "Stanford Regents",
    "tournamentId": "stanford2021",
    "tournamentName": "Stanford"
  });

  try {
    const savedTournament = await newTournament.save();
    res.status(200).send("New tournament created successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error: Unable to save user to database");
  }

}
createTournament();*/
});

module.exports = router;