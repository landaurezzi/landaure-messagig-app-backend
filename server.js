import express from 'express'
import mongoose from 'mongoose'
import Cors from 'cors'
import Messages from './dbMessages.js'
import Pusher from 'pusher'

//App config
const app = express()
const port = process.env.PORT || 9000
const connection_url = "mongodb+srv://admin:admin@cluster0.aseq5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

//Middleware
app.use(express.json())
app.use(Cors())

//DB config
mongoose.connect(connection_url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

//API endpoints
app.get("/", (req, res) => res.status(200).send("Hello TheWebDev"))

app.post('/messages/new', (req, res) => {
    const dbMessage = req.body
    Messages.create(dbMessage, (err, data) => {
        if(err){
        res.status(500).send(err)
        }
        else{
            res.status(201).send(data)
        }
    })
})

app.get('/messages/sync', (req, res) => {
    Messages.find((err, data) => {
        if(err){
            res.status(500).send(err)
        }
        else{
            res.status(200).send(data)
        }
    })
})

//Listener
app.listen(port, () => console.log(`Listening on localhost: ${port}`))