const express = require('express')
var bodyParser = require('body-parser')
const path = require('path')
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000
var jsonParser = bodyParser.json();

//MONGOOSE

//set up connection

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
  const uri = "mongodb+srv://yadavta:J1BfJKsaB3gvP60b@judgejs.hfqca.mongodb.net/judgejs?retryWrites=true&w=majority";
  mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    // all mongo code goes here
    const tournamentSchema = new mongoose.Schema({
      _id: String,
      tournamentName: String,
      tabroomName: String,
      circuits: Array,
      judgeTypes: Array,
      schoolApproved: Boolean,
      asIndependent: Boolean,
      startDate: Date,
      endDate: Date,
    });

    tournamentSchema.methods.speak = function () {
      console.log(this.tournamentName);
    }

    const Tournament = mongoose.model('Tournament', tournamentSchema);


    const tourneyAtHand = new Tournament({
      _id : data._id,
      tournamentName : data.tournamentName,
      tabroomName : data.tabroomName,
      circuits : data.circuits,
      judgeTypes : data.judgeTypes,
      schoolApproved : data.schoolApproved,
      asIndependent : data.asIndependent,
      startDate : data.startDate,
      endDate : data.endDate
    });
    tourneyAtHand.save();
  });

}

async function listTournaments() {

}

app.post('/tournament', function (req, res) {
});

app.post('/createTournament', jsonParser, function (req, res) {
    let data = req.body;
    const uri = "mongodb+srv://yadavta:J1BfJKsaB3gvP60b@judgejs.hfqca.mongodb.net/judgejs?retryWrites=true&w=majority";
    mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', async function() {
    	// all mongo code goes here
    	const tournamentSchema = new mongoose.Schema({
    	    _id: String,
    		tournamentName: String,
    		tabroomName: String,
    		circuits: Array,
    		judgeTypes: Array,
    		schoolApproved: Boolean,
    		asIndependent: Boolean,
    		startDate: Date,
    		endDate: Date,
    	});

    	tournamentSchema.methods.speak = function () {
    		console.log(this.tournamentName);
    	}

    	const Tournament = mongoose.model('Tournament', tournamentSchema);

		const tourneyAtHand = new Tournament({
    		_id : data._id,
    		tournamentName : data.tournamentName,
    		tabroomName : data.tabroomName,
    		circuits : data.circuits,
    		judgeTypes : data.judgeTypes,
    		schoolApproved : data.schoolApproved,
    		asIndependent : data.asIndependent,
    		startDate : data.startDate,
    		endDate : data.endDate
		});

		await tourneyAtHand.save()
    		.then(function(value) {
        		res.send(value);
		});

		});
});
