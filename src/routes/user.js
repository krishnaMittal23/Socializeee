const express = require('express');
const userRouter = express.Router();
const {userAuth} = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');


//get all the pending connection requests for the user
userRouter.get("/user/requests/received", userAuth, async(req,res)=>{

    try{
        const loggedInUser = req.user;

        //we have created reference to user model and fromUserId and we will populate the fromUserId here so that we can get the information about the user while fetching the connection requests

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status : "interested" 
        }).populate("fromUserId", ["firstName", "lastName","photoUrl", "age", "gender", "about","skills"]);


        if(connectionRequests.length === 0){
            return res.status(404).send("No connection requests found");
        }

        res.json({message: "Connection requests fetched successfully",
            data: connectionRequests
        })
    }
    catch(err){
        res.status(500).send("Error fetching connection requests: " + err.message);
    }
})


userRouter.get("/user/connections", userAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {toUserId: loggedInUser._id, status: "accepted"},
                {fromUserId: loggedInUser._id, status: "accepted"}
            ]
        }).populate("fromUserId", ["firstName", "lastName","photoUrl", "age", "gender", "about","skills"]).populate("toUserId", ["firstName", "lastName","photoUrl", "age", "gender", "about","skills"]);

        //we want just the info of fromUserid so we use map to get relevant info.

        const data = connectionRequests.map((row) => {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
            
        });

        res.json({data: connectionRequests, message: "Connections fetched successfully"});
    }
    catch(err){
        res.status(500).send("Error fetching connections: " + err.message);
    }
})


userRouter.get("/feed", userAuth, async(req,res)=>{
    try{

        // user should not see his own card, interested,ignored,accepted, rejected requests should not be shown in the feed

        const loggedInUser = req.user;


        const page = parseInt(req.query.page) || 1; //default page is 0
        let limit = parseInt(req.query.limit) || 10; //default limit is 10

        if(limit > 100){
            limit = 100; //to prevent too many users being fetched at once
        }

        const skip = (page - 1) * limit; //skip the first (page - 1) * limit users

        //find all connection requests (sent + received)
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {toUserId: loggedInUser._id},
                {fromUserId: loggedInUser._id}
            ]
        }).select("fromUserId toUserId");

        const hideUserFromFeed = new Set();
        connectionRequests.forEach(req => {
            hideUserFromFeed.add(req.fromUserId.toString());
            hideUserFromFeed.add(req.toUserId.toString());
        });

        const users = await User.find({
            $and: [{_id:{ $nin: Array.from(hideUserFromFeed)}},
                {_id: {$ne: loggedInUser._id}} //to not show the logged in user in the feed   (id not equal to loggedInUser._id)
             ],  //nin means not in , id not present in hideUserFromFeed array
        }).select(["firstName", "lastName","photoUrl", "age", "gender", "about","skills"]).skip(skip).limit(limit)  //to send only relevant data in the response

        res.send(users);

        //url to give:
        //http://localhost:3000/feed?page=1&limit=10


        
    }
    catch{
        res.status(500).send("Error fetching feed: " + err.message);
    }
})


module.exports = userRouter;