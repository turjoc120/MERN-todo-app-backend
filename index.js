const express = require("express")
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId
require('dotenv').config()
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000;

// middlewares
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sg7vl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {

    try {

        await client.connect()
        const database = client.db("todoBase")
        const todosCollection = database.collection('todos')

        // get api 
        app.get('/allTask', async (req, res) => {
            const result = await todosCollection.find({}).toArray()
            res.json(result)
        })

        // get a single one 
        app.get('/task/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await todosCollection.findOne(query)
            res.json(result)
        })

        // update api
        app.put('/task/update/:id', async (req, res) => {
            const task = req.body
            const updateTask = {
                $set: {
                    description: task.description,
                    title: task.title,
                    date: task.date,
                    // status: task.status,
                },
            }
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const result = await todosCollection.updateOne(filter, updateTask, options)
            res.json(result)
        })

        // update status
        app.put('/taskstatus/:id', async (req, res) => {
            const task = req.body
            const updateTask = {
                $set: {
                    status: task.status
                },
            }
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const result = await todosCollection.updateOne(filter, updateTask, options)
            res.json(result)
        })

        // delete api 
        app.delete('/task/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await todosCollection.deleteOne(query)
            res.json(result)
        })

        // post api 
        app.post('/addTask', async (req, res) => {
            const task = req.body
            const result = await todosCollection.insertOne(task)
            res.json(result)
        })

    }
    finally {
        // client.close()
    }

}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send("running the todo server")
})

app.listen(port, () => {
    console.log("listening to the port", port);
})