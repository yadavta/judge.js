const express = require('express')
var bodyParser = require('body-parser')
const path = require('path')
const PORT = process.env.PORT || 5000

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://yadavta:J1BfJKsaB3gvP60b@judgejs.hfqca.mongodb.net/judgeJS?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
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


async function createTournament (data) {
	var result = "";
	try {
		await client.connect();
		const database = client.db("judgejs");
		const collection = database.collection("tournaments");
		// create a document to be inserted
		var d = new Date();
		var year = d.getFullYear();
	   	const doc = {
			"_id" : (data.tournamentName.toLowerCase() + year),
			"name" : data.tournamentName,
			"tabroomName" : data.tabroomName,
			"schoolApproved" : data.schoolApproved
		};
	
		await collection.insertOne(doc).then(x => {
			result = x
		})
		
	} finally {
	    await client.close();
 	}
	return result;
}

async function listTournaments(listData) {
	var result = "";
	try {
		await client.connect();
		const database = client.db("judgejs");
		const collection = database.collection("tournaments");
		let arr =  await collection.find();
		result = arr.toArray();
		
	} finally {
	    await client.close();
 	}
	return "hello world";
}

app.post('/tournament', function (req, res) {
	var returnable;
	listTournaments().then(response => (returnable = response));
	res.send(returnable);
})

app.post('/create', jsonParser, function (req, res) {
	let returnable = createTournament(req.body);
	res.send(returnable);
})
