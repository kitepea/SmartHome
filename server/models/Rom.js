const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const userSchema = new mongoose.Schema({
    roomname:{
        type:String,
        required:true
    },
    temperature:{
        type: Number,
        required:true
    },
    humidity:{
        type: Number,
        require: true
    },
    brightness:{
        type: Number,
        require: true
    },
    fans:[{
        type: ObjectId,
        ref: "Fan"
    }],
    lights:[{
        type: ObjectId,
        ref: "Light"
    }]
})
mongoose.model("Rom",userSchema)