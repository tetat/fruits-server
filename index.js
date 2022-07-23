const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const { query } = require('express');
// const jwt = require('jsonwebtoken');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8nc9y.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const fruitCollection = client.db('fruitsHouse').collection('product');
        const addedCollection = client.db('fruitHouse').collection('record');

        // create or insert data
        app.post('/fruits', async (req, res) => {
            const newFruits = req.body;
            console.log(newFruits);
            const result = await fruitCollection.insertOne(newFruits);
            res.send(result);
        });
        app.post('/add', async (req, res) => {
            const newRecord = req.body;
            const result = await addedCollection.insertOne(newRecord);
            res.send(result);
        })

        // Read data
        app.get('/fruits', async (req, res) => {
            const query = {};
            const cursor = fruitCollection.find(query);
            const fruits = await cursor.toArray();
            res.send(fruits);
        });

        app.get('/fruits/:fruitId', async (req, res) => {
            const fruitId = req.params.fruitId;
            const query = { _id: ObjectId(fruitId) };
            const fruit = await fruitCollection.findOne(query);
            res.send(fruit);
        });

        app.get('/add', async (req, res) => {
            const query = {};
            const cursor = addedCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });
        app.get('/add/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const fruit = await addedCollection.findOne(query);
            res.send(fruit);
        })

        // update data
        app.put('/fruits/:fruitId', async (req, res) => {
            const fruitId = req.params.fruitId;
            const filter = { _id: ObjectId(fruitId) };
            const fruit = await fruitCollection.findOne(filter);
            const updateFruits = req.body;
            const options = { upsert: true };

            // console.log(updateFruits);

            const updateDoc = {
                $set: {
                    quantity: updateFruits.quantity ? updateFruits.quantity : fruit.quantity,
                    shortDescription: updateFruits.shortDescription ? updateFruits.shortDescription : fruit.shortDescription,
                    img: updateFruits.img ? updateFruits.img : fruit.img,
                    sold: updateFruits.sold ? updateFruits.sold : fruit.sold
                }
            }

            console.log(updateFruits);
            console.log(updateDoc);

            const result = await fruitCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        });

        // delete data
        app.delete('/fruits/:fruitId', async (req, res) => {
            const fruitId = req.params.fruitId;
            const query = { _id: ObjectId(fruitId) };
            const result = await fruitCollection.deleteOne(query);
            res.send(result);
        });

        app.delete('/add/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await addedCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally {

    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Fruits are dancing');
});

app.listen(port, () => {
    console.log('Running at ', port);
})