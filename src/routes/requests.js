const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");

const ConnectionRequest = require("../models/connectionRequest");

const express = require('express');
const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId",userAuth, async(req,res)=>{

  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    if(fromUserId === toUserId){
      return res.status(400).send("You cannot send a request to yourself");
    } 

    const status = req.params.status;

    const allowedStatus = ["ignored", "interested"];
    if(!allowedStatus.includes(status)){
      return res.status(400).json({message: "invalid status type: " + status})
    }

    const toUser = await User.findById(toUserId);
    if(!toUser){
      return res.status(404).send("User not found with id: " + toUserId);
    }


    //if there is an existing connection request
    const exisitingConnectionRequest = await ConnectionRequest.findOne({

      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId }
      ]
    });

    if(exisitingConnectionRequest){
      return res.status(400).send("connection request already exist")
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status 
    });

    const data = await connectionRequest.save();

    res.json({
      message: req.user.firstName +  " sent a connection request to " + toUser.firstName ,
      data,
    })
    
  } catch (error) {
    res.status(400).send("ERROR: "+ error.message)
  }
  
}) 

requestRouter.post("/request/review/:status/:requestId", userAuth, async(req,res)=>{
  try {
    const loggedInUser = req.user;
    //loggedInUser = toUserId
    //status = interested
;
    const status = req.params.status;
    const requestId = req.params.requestId;

    const allowedStatus = ["accepted", "rejected"];
    if(!allowedStatus.includes(status)){
      return res.status(400).json({message: "invalid status type: " + req.params.status})
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested" //only interested requests can be accepted or rejected
    });

    if(connectionRequest === null){
      return res.status(404).send("Connection request not found");
    }

    connectionRequest.status = status; //update the status of the connection request

    const data = await connectionRequest.save();

    res.json({message: "connection request "+status, data})

  } catch (error) {
    return res.status(400).send("ERROR: " + error.message);
    
  }
})


module.exports = requestRouter;