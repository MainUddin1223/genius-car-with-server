const express = require("express");
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000;
const app = express();
//midleware

app.use(cors());
app.use(express.json());

/// connection to database


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.BD_PASS}@cluster0.atbu1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const serviceCollection = client.db('geniusCar').collection('servicea');
        app.get('/service', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })

        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.findOne(query);
            res.send(result)
        })
        //post
        app.post('/service', async (req, res) => {
            const newService = req.body;
            const result = await serviceCollection.insertOne(newService);
            res.send(result)
        })

        app.delete('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.deleteOne(query);
            if (result.deletedCount === 1) {
                res.send(result)
            }
        })

    }
    finally {
        // await client.close();
    }

}
run().catch(console.dir);

//

app.get('/', (req, res) => {
    res.send('I am running')
})

app.listen(port, () => {
    console.log('hello world');
})