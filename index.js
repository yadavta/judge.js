const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://yadavta:J1BfJKsaB3gvP60b@judgejs.hfqca.mongodb.net/judgeJS?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

/*client.connect(err => {
  const collection = client.db("jugdeJS").collection("tournaments");
  const pizzaDocument = {
  name: "Neapolitan pizza",
  shape: "round",
  toppings: [ "San Marzano tomatoes", "mozzarella di bufala cheese" ],
  };
  const result = await pizzaCollection.insertOne(pizzaDocument);
  console.dir(result.insertedCount); // should print 1 on successful insert
  client.close();
});*/

async function run() {
  try {
    await client.connect();
    const database = client.db("judgejs");
    const collection = database.collection("tournaments");
    // create a document to be inserted
    const doc = { name: "Red", town: "kanto" };
    const result = await collection.insertOne(doc);
    console.log(
      `${result.insertedCount} documents were inserted with the _id: ${result.insertedId}`,
    );
  } finally {
    await client.close();
  }
}
run().catch(console.dir);

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/about',(req,res)=> res.render('pages/about'))
  app.get('/', function (req, res) {
    res.send('hello world')
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
