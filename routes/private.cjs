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

module.exports = router;