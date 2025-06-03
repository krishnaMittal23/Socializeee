//npm i mongoose

const mongoose = require('mongoose')

const connectDB = async()=>{
    await mongoose.connect("mongodb+srv://krishna:krishna@codelearn.uv5ayu3.mongodb.net/devTinder")
}

module.exports = connectDB;

