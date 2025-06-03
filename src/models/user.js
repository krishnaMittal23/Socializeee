const mongoose = require('mongoose');
const validator = require('validator');


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 20,
        index: true, //this will create an index on this field for faster lookups
    },
    lastname:{
        type:String,
        
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(validator.isEmail(value) === false){
                throw new Error("Invalid email address");
            }
        }
    },
    password: {
        type:String,
        required: true,
        validate(value){
            if(validator.isStrongPassword(value) === false){
                throw new Error("given password is not strong enough");
            }
        }
    },
    age:{
        type: Number,
        min:10,
    },
    gender:{
        type: String,
        //custom validation function
        //but by default this will work only when new user is inserted so we need to write something inside path to make it work there also
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("gender not valid")
            }
        }
    },
    photoUrl:{
        type: String,
        default : "https://avatars.githubusercontent.com/u/193494648?v=4&size=64",
        // validate(value){
        //     if(validator.isURL(value) === false){
        //         throw new Error("Invalid photo url");
        //     }
        // }
    },
    about:{
        type: String,
        default: "Hey there! I am using this app",
    },
    skills:{
        type: [String],
    },

},

{
    timestamps: true, //adds createdAt and updatedAt fields
    //versionKey: false, //removes __v field
});


//we can also write the JWT creation code here and basically offload it to the schema so that we need bot to write it in app.js


//dont use arrow functions here bcz this will not work with arrow functions as 'this' will not refer to the current document
// userSchema.methods.getJWT = async function(){

//     const user = this; // 'this' refers to the current user document
//     const token =  await jwt.sign({ _id: user._id }, "SecretKey", {expiresIn: '7d'});
//     return token;
// }


//and we need to write below code in app.js
// const token = await user.getJWT();


//creating index when we need to query with firstname and lastname simultaneously
userSchema.index({ firstName: 1, lastname: 1 }); //this will create a compound index on firstName and lastname fields for faster lookups
//1 means ascending order


//creating model
const User = mongoose.model("User", userSchema);
module.exports = User;
    


//mongoDb will automatially create indexes for "unique" fields for faster lookups
//for other fields make index:true in the schema