const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData } = require("../utils/validation");
const express = require('express');
const profileRouter = express.Router();


//profile api
profileRouter.get("/profile/view",userAuth, async (req, res) => {
  try {
   
    const user = req.user;

    res.send(user);

    //install cookie-parser to read the cookies
    //npm i cookie-parser
  } catch (err) {
    res.status(500).send("Error fetching profile " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async(req,res)=>{
    try {
        if(!validateProfileEditData(req)){
            throw new Error("Invalid edit request");
        }

        //user is already attached to req object by userAuth middleware
        const loggedInUser = req.user;
        //console.log(loggedInUser);
        
        Object.keys(req.body).forEach(key => (loggedInUser[key] = req.body[key]));

        // console.log(loggedInUser);
        await loggedInUser.save()

        res.json({
            message: "Profile updated successfully",data: loggedInUser});

    } catch (err) {
        return res.status(400).send("Invalid data " + err.message);
        
    }
})


module.exports = profileRouter;