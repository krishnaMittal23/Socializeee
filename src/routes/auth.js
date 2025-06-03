const { validateSignupData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

//creating express router

const express = require("express");
const authRouter = express.Router();

//remove APIs from app.js and add them here to make cleaner code
authRouter.post("/signup", async (req, res) => {
  try {
    //validation of data
    validateSignupData(req);

    //encrypt the password
    //npm i bcrypt
    //bcrypt library

    const { password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);
    //10 is the salt rounds, it determines how many times the password will be hashed
    //console.log(passwordHash);

    const { firstName, lastname, emailId } = req.body;

    const existing = await User.findOne({ emailId: emailId });
    if (existing) {
      res.status(400).send("User already exists with this emailId");
    }

    //creating new instance of user model
    const user = new User({
      firstName,
      lastname,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.send("User created successfully");
  } catch (err) {
    res.status(500).send("Error creating user " + err.message);
  }
});


//login api
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      //install jsonwebtoken library
      //create a JWT token
      const token = await jwt.sign({ _id: user._id }, "SecretKey", {expiresIn: '7d'});

      //add the token to cookie and send the response to the user
      res.cookie("token", token);
 
      res.send("Login successful");
    } else {
      throw new Error("invalid credentials");
    }
  } catch (err) {
    res.status(500).send("Error logging in " + err.message);
  }
});

//logout
authRouter.post("/logout", async (req,res)=>{
  res.cookie("token", null , {
    expires: new Date(Date.now()),
  })

  res.send("Logout successful");

})

module.exports = authRouter;