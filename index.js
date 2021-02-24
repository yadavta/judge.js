const express = require('express');
var bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const {ExpressOIDC} = require('@okta/oidc-middleware');
const PORT = process.env.PORT || 5000
var jsonParser = bodyParser.json();
require('dotenv').config()

var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-west-2",
  //endpoint: "https://dynamodb.us-west-2.amazonaws.com",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

var docClient = new AWS.DynamoDB.DocumentClient();

var app = express()
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => res.render('pages/index'))

app.use(session({
  secret: 'DJf_y1MMsVXFysw_7YVLvkxrQ_1j8z1mNqrEDgFQ',
  resave: true,
  saveUninitialized: false
}));

const oidc = new ExpressOIDC({
  appBaseUrl: "https://judge-js.herokuapp.com",
  issuer: process.env.OKTA_ISSUER,
  client_id: process.env.OKTA_CLIENT_ID,
  client_secret: process.env.OKTA_CLIENT_SECRET,
  redirect_uri: process.env.OKTA_REDIRECT_URI,
  scope: 'openid profile'
});

app.use(oidc.router);

app.get('/protected/testing', oidc.ensureAuthenticated(), (req, res) => {
  res.render('pages/testing');
});

app.post('/api/auth', oidc.ensureAuthenticated(), (req, res) => {
  res.send(JSON.stringify(req.userContext.userinfo));
});

app.get('/login', (req, res) => res.render('pages/login'))
app.get('/about', (req, res) => res.render('pages/about'))
app.get('/create', (req, res) => res.render('pages/create'))
app.get('/tournaments', (req, res) => res.render('pages/tournaments'))
app.get('/calendar', (req, res) => res.render('pages/calendar'))
app.get('/event', (req,res) => res.render('pages/event', {user_id:'wassup'}))
//app.get('/protected/testing', (req,res)=>res.render('pages/testing'))
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))



async function listTournaments() {
  let x;
  var params = {
    TableName: "tournaments"
  }
  await docClient.scan(params).promise().then(data => {
    //console.log(data);
    x = data.Items;
  });
  return x;
}

async function calendarTournaments(){
  let c;
  var params = {
    TableName: "tournaments",
    Select: "SPECIFIC_ATTRIBUTES",
    ProjectionExpression: "tournamentId, tournamentName, startDate, endDate"
  };
  await docClient.scan(params).promise().then(data => {
    //console.log(data);
    c = data.Items;
  });
  return c;
}

async function createTournaments(newTourneyData) {
  let amazonResponse;
  var params = {
    TableName: "tournaments",
    Item: newTourneyData,
  }

  await docClient.put(params).promise().then(data => {
    amazonResponse = data;
  });

  return amazonResponse;
}

app.get('/api/tournaments', function(req, res) {
  listTournaments().then(function(data) {
    res.send(data);
  })
});

app.post('/api/tournaments', jsonParser, function(req, res) {

  /*createTournaments(req.body).then(function(data){
    res.send(data);
  })*/

});

app.get('/api/tournaments/calendar', jsonParser, function(req,res) {
  calendarTournaments().then(function(data){
      res.send(data);
  });
});

console.log("Github Integration is working");
console.log("moved local git repository");
