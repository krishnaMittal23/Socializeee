const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async(req,res,next)=>{
    try {
        //read the token from the req cookies
        const {token} = req.cookies;
        if(!token){
            return res.status(401).send("Unauthorized access, please login first");
        }
    
        const decodedObj = await jwt.verify(token, "SecretKey");
        const { _id } = decodedObj;
        const user = await User.findById(_id);
    
        if(!user){
            throw new Error("User not found");
        }

        req.user = user; // attach user to request object so that it can be accessed in the next middleware or route handler and we need not to write same code again in /profile API

        next();
        
        //validate the token
        //find the  user
    } catch (err) {
        res.status(401).send("Unauthorized access, please login first " + err.message);
    }
}

module.exports = {
    userAuth
}