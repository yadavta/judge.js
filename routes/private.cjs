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

const router = require('express').Router();
const cookieParser = require('cookie-parser');
var dayjs = require('dayjs')
const Session = require('../utils/models/Session.js');

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

module.exports = router;