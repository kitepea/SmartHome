const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    state:{
        type: Boolean,
        required:true
    },
    automode:{
        type: Boolean,
        require: true
    },
    threshold:{
        type: Number,
        require: false
    },
    sche_mode:{
        type: Boolean,
        require: true
    },
    ontime:{
        type: Date,
        require: false,
    },
    offtime:{
        type: Date,
        require: false,
    }
})
mongoose.model("Light",userSchema)