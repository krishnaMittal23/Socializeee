//this will define connection request between two users

const mongoose = require("mongoose");
const connectionRequestSchema = new mongoose.Schema({

    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        
        required: true,

        ref: "User" //this will create a reference to the User model
        //we are creating a link between these two collections as we want to get the data of the uesrs while fetching connection requests
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        
        required: true,
        ref: "User" 
    },
    status: {
        type: String,
        enum: {
            values: ["ignore", "accepted", "rejected","interested"],
            message: `{VALUE} is not a valid status`
        },
        //use enum when we want user to select from a set of values
        required: true

    }

},
{
    timestamps: true //this will add createdAt and updatedAt fields automatically
});

// connectionRequestSchema.pre("save", function(){
//     const connectionRequest = this;
//     //this will run before saving the connection request (it is a middleware)
//     //check if fromUserId and toUserId are same
//     if(connectionRequest.fromUserId.toString() === connectionRequest.toUserId.toString()){
//         throw new Error("You cannot send a connection request to yourself");
//     }

//     //we can write this validation in the route also but it is better to write it here so that it is always checked before saving the connection request
//     next();
// })

//querying becomes easier with index
connectionRequestSchema.index({fromUserId : 1, toUserId: 1}); //this will create a unique index on fromUserId and toUserId fields, so that there cannot be two connection requests between the same users


const ConnectionRequestModel = new mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequestModel;