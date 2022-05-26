//To give mongo db connection details

//mongoose import
const mongoose = require('mongoose')

//state connection string
mongoose.connect('mongodb://localhost:27017/bank',{
    useNewUrlParser:true
})

//model creation
const User = mongoose.model('user',{
    acno: Number,
    uname: String,
    password: String,
    balance: Number,
    transaction:[]
})

//export model - user
module.exports={
    User
}