import express from 'express'
import mongoose from 'mongoose'
import Cors from 'cors'
import Messages from './dbMessages.js'
import Pusher from 'pusher'

//App config
const app = express()
const port = process.env.PORT || 9000
const connection_url = "mongodb+srv://admin:admin@cluster0.aseq5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

//const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1401286",
  key: "e9eb5617509a018ef074",
  secret: "a8367666fc9b57e2a192",
  cluster: "us3",
  useTLS: true
});

//Middleware
app.use(express.json())
app.use(Cors())

//DB config
mongoose.connect(connection_url, {
    useNewUrlParser: true,
    //useCreateIndex: true,
    useUnifiedTopology: true
})

//API endpoints
const db = mongoose.connection
db.once("open", () => {
    console.log("DB Connected")
    const msgCollection = db.collection("messagingmessages")
    const changeStream = msgCollection.watch()
    changeStream.on('change', change => {
        console.log(change)
        if(change.operationType === "insert") {
            const messageDetails = change.fullDocument
            pusher.trigger("messages", "inserted", {
                name: messageDetails.name,
                message: messageDetails.message,
                timestamp: messageDetails.timestamp,
                received: messageDetails.received
            })
        }
        else {
            console.log('Error triggering Pusher')
        }
    })
})
app.get("/", (req, res) => res.status(200).send("Hello TheWebDev"))



app.post('/messages/new', (req, res) => {
    const dbMessage = req.body
    console.log("Sending message to room", req.body.roomID)
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
    if (req.query.room == "1") {
        console.log("getting room 1 messages")
        Messages.find({roomID:"1"},(err, data) => {
            if(err){
                res.status(500).send(err)
            }
            else{
                res.status(200).send(data)
            }
        })
    }
    else if (req.query.room == "2") {
        console.log("getting room 2 messages")
        Messages.find({roomID:"2"},(err, data) => {
            if(err){
                res.status(500).send(err)
            }
            else{

                res.status(200).send(data)
            }
        })
    }
})

//Listener
app.listen(port, () => console.log(`Listening on localhost: ${port}`))