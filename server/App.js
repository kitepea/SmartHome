const express = require('express')
const mongoose =require('mongoose')
const cors = require('cors');
const {MONGOURI}=require("./Key")
require('./models/User.js')

const PORT =5000
const app=express()
app.use(cors());
app.use(express.json());

mongoose.connect(MONGOURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
mongoose.connection.on('connected',()=>{
    console.log("connected to mongo")
})
mongoose.connection.on('error',(err)=>{
    console.log("error connecting",err)
})

app.use(require('./routes/Auth'))




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

