const router = require('express').Router();
var dayjs = require('dayjs');

const Session = require('../utils/models/Session.js');
const Blog = require('../utils/models/Blog.js');
const User = require('../utils/models/User.js');
const Entry = require('../utils/models/Entry');
const Tournament = require('../utils/models/Tournament');

router.use(async function isAdmin(req, res, next) {
  let providedToken = req.cookies.sessionToken;
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

        await User.findOne({ _id: res.locals.userId }, 'fullName group').then(results => {
          if (results === null) {
            res.send(500);
          }
          res.locals.userName = results.fullName;
          if (results.group === "admin") {
            res.locals.admin = true;
            next();
          } else {
            res.sendStatus(403);
          }
        })
      }
      else {
        console.log("bad token");
        res.redirect('/login/' + requestedURL);
      }
    }

  } catch (err) {
    console.log(err);
    res.redirect('/login/' + requestedURL);
  }

});

router.get('/approve/entry', (req, res) => {
  res.render('pages/admins/approveEntry');
});

router.post('/approve/entry/list', (req, res) => {

  if ((req.body.tournamentId === "all") && (req.body.event === "all")) {
    Entry.find({ entryStatus: "requested" }).exec((err, docs) => {
      if (err === null) {
        res.send(docs);
      } else {
        res.sendStatus(500);
      }
    });
  }
  else if (req.body.tournamentId === "all") {
    Entry.find({ entryEvent: req.body.event, entryStatus: "requested" }).exec((err, docs) => {
      if (err === null) {
        res.send(docs);
      } else {
        res.sendStatus(500);
      }
    });
  } else if (req.body.event === "all") {
    Entry.find({ entryTournamentId: req.body.tournamentId, entryStatus: "requested" }).exec((err, docs) => {
      if (err === null) {
        res.send(docs);
      } else {
        res.sendStatus(500);
      }
    });
  } else {
    Entry.find({ entryEvent: req.body.event, entryTournamentId: req.body.tournamentId, entryStatus: "requested" }).exec((err, docs) => {
      if (err === null) {
        res.send(docs);
      } else {
        res.sendStatus(500);
      }
    });
  }

});

router.post('/approve/entry/yes', (req, res) => {

  async function approveEntry() {

    Entry.findOneAndUpdate({ _id: req.body.entryId }, { entryStatus: "approved" }, { new: true }).exec((err, docs) => {
      if (err === null) {
        res.sendStatus(200);
      } else {
        res.sendStatus(500);
      }
    });
  }

  approveEntry();

});

router.post('/approve/entry/no', (req, res) => {

  async function denyEntry() {

    Entry.findOneAndUpdate({ _id: req.body.entryId }, { entryStatus: "denied" }, { new: true }).exec((err, docs) => {
      if (err === null) {
        res.sendStatus(200);
      } else {
        res.sendStatus(500);
      }
    });
  }

  denyEntry();

});


module.exports = router;