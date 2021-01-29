const express = require('express')
var bodyParser = require('body-parser')
const path = require('path')
const PORT = process.env.PORT || 5000

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://yadavta:J1BfJKsaB3gvP60b@judgejs.hfqca.mongodb.net/judgeJS?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
var jsonParser = bodyParser.json()


async function testing (data) {
  try {
  	var result;
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
    result = await collection.insertOne(doc);    
  } finally {
    await client.close();
    return result;
  }
}


var app = express()
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => res.render('pages/index'))
app.get('/about',(req,res)=> res.render('pages/about'))
app.get('/create', (req,res)=> res.render('pages/create'))
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
app.post('/about', jsonParser, function (req, res) {
	var x = testing(req.body);
	res.send(x)
})
