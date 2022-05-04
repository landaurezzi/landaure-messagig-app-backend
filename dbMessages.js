import mongoose from 'mongoose'
const messagingSchema = mongoose.Schema({
    message: String,
    name: String,
    timestamp: String,
    received: Boolean,
    roomID: String
})

export default mongoose.model('messagingmessages', messagingSchema)