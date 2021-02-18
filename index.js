const express = require('express')
var bodyParser = require('body-parser')
const path = require('path')
const PORT = process.env.PORT || 5000
var jsonParser = bodyParser.json();

var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-west-2",
  endpoint: "https://dynamodb.us-west-2.amazonaws.com",
  accessKeyId: "AKIAZ4SPQWYIWWNK5JU6",
  secretAccessKey: "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"
});

var docClient = new AWS.DynamoDB.DocumentClient();

var app = express()
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => res.render('pages/index'))
app.get('/about',(req,res)=> res.render('pages/about'))
app.get('/create', (req,res)=> res.render('pages/create'))
app.get('/tournament', (req,res)=> res.render('pages/tournament'))
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

async function listTournaments() {
	let x;
	var params = {
        TableName : "tournaments"
    }
    await docClient.scan(params).promise().then(data => {
		//console.log(data);
		x = data.Items;
	});
	return x;
}

async function createTournament(newTourneyData){
    let amazonResponse;
    var params = {
        TableName : "tournaments",
        Item : newTourneyData,
    };

    await docClient.put(params).promise().then(data => {
        amazonResponse = data;
    })

    return amazonResponse;
}

app.post('/tournament', function (req, res) {
    listTournaments().then(function(data){
        res.send(data);
    })
});

app.post('/createTournament', jsonParser, function (req, res) {
    createTournament(req.body).then(function(data){
	       res.send(data);
    })
});
