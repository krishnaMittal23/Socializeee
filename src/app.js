const express = require("express");
const app = express();

const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignupData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

app.use(express.json()); // to parse JSON data from the request body
app.use(cookieParser()); // to parse cookies from the request

//any other data apart from schema will be ignored by mongoose


const authRouter = require("./routes/auth");
const requestRouter = require("./routes/requests");
const profileRouter = require("./routes/profile");
const userRouter = require("./routes/user");
//using routes

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/",userRouter)










//using options
// await User.findByIdAndUpdate({_id: userId},data,{
//     returnDocument: 'after', //returns the updated document
// });

//first connect to database and then server
connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.log("Database connection failed", err);
  });

//validator library -> npm i validator
