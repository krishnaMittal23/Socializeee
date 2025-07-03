//npm i mongoose

const mongoose = require('mongoose')

const connectDB = async()=>{
    await mongoose.connect("mongodb+srv://krishna2024:zqtu6jqOOY25j5xJ@testing.kshttfz.mongodb.net/devTinder");
}

module.exports = connectDB;

