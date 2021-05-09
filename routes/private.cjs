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
        next();
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
  res.render('../views/pages/privates/homepage')
});

router.get('/create/blog', (req, res) => {
  res.render('../views/pages/privates/createPost');
})

router.get('/create/tournament', (req, res) => {
  res.render('../views/pages/privates/createTournament')
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

          docCount ++;
          countedId = docCount.toString();

          let newBlog = new Blog({
            _id: countedId,
            postTitle: req.body.postTitle,
            postContent: req.body.postContent,
            postImage: req.body.postImage,
            postImageAlt: req.body.postImageAlt,
            postAuthorName: results.fullName,
            postAuthorId: res.locals.userId,
            postDate: req.body.postDate
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

module.exports = router;