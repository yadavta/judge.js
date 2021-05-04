//npm imports
const express = require('express');
const path = require('path');
require('dotenv').config();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

//local node modules
const reminderEmails = require('./utils/emails/reminder.cjs');

//set up npm modules
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }, () => console.log("DB Connected!"));

const Heroku = require("heroku-client");
const heroku = new Heroku({ token: process.env.HEROKU_API_TOKEN });


const PORT = process.env.PORT || 5000

//CURRENTLY SWITCHING FROM AMAZON DYNAMODB TO MONGODB

var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-west-2",
  endpoint: "https://dynamodb.us-west-2.amazonaws.com",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

var docClient = new AWS.DynamoDB.DocumentClient();

var app = express();
const authRoute = require('./routes/auth.cjs');
const privateRoute = require('./routes/private.cjs');
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')
app.use(express.json());
app.use(cookieParser());
app.use('/auth', authRoute);
app.use('/private', privateRoute);
app.get('/', (req, res) => res.render('pages/index'))


app.get('/login', (req, res) => res.render('pages/login'));
app.get('/signup', (req, res) => res.render('pages/signup')); 
app.get('/about', (req, res) => res.render('pages/about'))
app.get('/create', (req, res) => res.render('pages/create'))
app.get('/tournaments', (req, res) => res.render('pages/tournaments'))
app.get('/calendar', (req, res) => res.render('pages/calendar'))
app.get('/event', (req, res) => res.render('pages/event'));
app.get('/socket', (req, res) => res.render('pages/socket'))
//app.get('/protected/testing', (req,res)=>res.render('pages/testing'))
app.listen(PORT, () => console.log(`Listening on ${PORT}`))



//CURRENTLY SWITCHING FROM AMAZON TO MONGO

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

async function calendarTournaments() {
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

async function eventTournaments(specificTourneyData) {
  let e;
  var params = {
    TableName: 'tournaments',
    KeyConditionExpression: '#tournId = :tourneyId',
    ExpressionAttributeNames: {
      "#tournId": "tournamentId"
    },
    ExpressionAttributeValues: {
      ":tourneyId": specificTourneyData.tournamentId
    }
  };

  await docClient.query(params).promise().then(data => {
    console.log(data);
    e = data.Items;
  });
  return e;

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

async function alertTournament(specificTourneyData) {
  let a;
  var params = {
    TableName: "tournaments",
    //Select: "SPECIFIC_ATTRIBUTES",
    //ProjectionExpression: "tournamentId, tournamentName, startDate, endDate, adminAlerts", 
    KeyConditionExpression: '#tournId = :tourneyId',
    ExpressionAttributeNames: {
      "#tournId": "tournamentId"
    },
    ExpressionAttributeValues: {
      ":tourneyId": specificTourneyData.tournamentId
    }
  };
  await docClient.query(params).promise().then(data => {
    //console.log(data);
    a = data.Items;
  });
  return a;
}

async function alertTournament(specificTourneyData) {
  let a;
  var params = {
    TableName: "tournaments",
    //Select: "SPECIFIC_ATTRIBUTES",
    //ProjectionExpression: "tournamentId, tournamentName, startDate, endDate, adminAlerts",
    KeyConditionExpression: '#tournId = :tourneyId',
    ExpressionAttributeNames: {
      "#tournId": "tournamentId"
    },
    ExpressionAttributeValues: {
      ":tourneyId": specificTourneyData.tournamentId
    }
  };
  await docClient.query(params).promise().then(data => {
    //console.log(data);
    a = data.Items;
  });
  return a;
}

const transitionMessage = "currently transitioning to Mongo, this service unavailable";

async function createTournaments(){
  return transitionMessage;
}

async function listTournaments() {
  return transitionMessage;
}

async function calendarTournaments() {
  return transitionMessage;
}

async function eventTournaments() {
  return transitionMessage;
}

app.post('/api/tournaments/cards', jsonParser, function (req, res) {
  console.log(req.body);
  alertTournament(req.body).then(function (data) {
    console.log(data.adminAlerts);
    res.send(data);
  });
});

app.get('/api/tournaments', function (req, res) {
  listTournaments().then(function (data) {
    res.send(data);
  })
});

app.post('/api/tournaments', jsonParser, function (req, res) {

  createTournaments(req.body).then(function (data) {
    res.send(data);
  })

});

app.get('/api/tournaments/calendar', jsonParser, function (req, res) {
  calendarTournaments().then(function (data) {
    res.send(data);
  });
});

app.post('/api/tournaments/event', jsonParser, function (req, res) {
  console.log(req.body);
  //res.send(req.body.tournamentId);
  eventTournaments(req.body).then(function (data) {
    res.send(data);
  });
});

app.post('/api/tournaments/cards', jsonParser, function (req, res) {
  console.log(req.body);
  alertTournament(req.body).then(function (data) {
    console.log(data);
    res.send(data);
  });
});
