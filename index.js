const express = require('express')
var bodyParser = require('body-parser')
const path = require('path')
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const PORT = process.env.PORT || 5000

const uri = "mongodb+srv://yadavta:J1BfJKsaB3gvP60b@judgejs.hfqca.mongodb.net/judgejs?retryWrites=true&w=majority";
const client = new MongoClient(uri);
client.connect();
//const client = new MongoClient(uri, { useNewUrlParser: true });
var jsonParser = bodyParser.json();


var app = express()
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => res.render('pages/index'))
app.get('/about',(req,res)=> res.render('pages/about'))
app.get('/create', (req,res)=> res.render('pages/create'))
app.get('/tournament', (req,res)=> res.render('pages/tournament'))
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))


async function createTournament (hack) {
	/*var result = "";
	try {
		await client.connect();
		const collection = client.db("judgejs").collection("tournaments");
		// create a document to be inserted
			const doc = {
				"_id" : data._id,
				"tournamentName" : data.tournamentName,
				"tabroomName" : data.tabroomName,
				"circuits" : data.circuits,
				"judgeTypes" : data.judgeTypes,
				"schoolApproved" : data.schoolApproved,
				"asIndependent" : data.asIndependent,
				"startDate" : data.startDate,
				"endDate" : data.endDate
			}

		await collection.insertOne(doc)
		.then(function(response) {
			result = response;
		});

	} finally {
	    await client.close();
 	}
	return result;*/
}

async function listTournaments() {
	var result = "";
        const collection = client.db("judgejs").collection("tournaments");
    	collection.find().toArray(function(err,response) {
    		result = response;
        });

        await client.close();
        return result;
}

app.post('/tournament', function (req, res) {
	listTournaments().then(function(result) {
		res.send(result);
	});
});

app.post('/create', jsonParser, function (req, res) {
	let returnable = createTournament(req.body);
	res.send(returnable);
});
