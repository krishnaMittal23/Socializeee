const validator = require("validator");

const validateSignupData = (req)=>{
    const {firstName,lastName,emailId,password} = req.body;
    
    if(!firstName ||  !emailId || !password) {
        throw new Error("All fields are required");
    }

    else if(firstName.length < 4|| firstName.length>50){
        throw new Error("First name must be between 4 and 50 characters");
    }

    else if(!validator.isEmail(emailId)) {
        throw new Error("Invalid email format");
    }

    else if(!validator.isStrongPassword(password)){
        throw new Error("Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one symbol");
    }
}

const validateProfileEditData = (req)=>{
    const allowedEditFields = ["firstName", "lastName", "emailId", "photoUrl","gender","age","about","skills"];

    const isEditAllowed = Object.keys(req.body).every(field => allowedEditFields.includes(field)) ;

    return isEditAllowed;
} 


module.exports = {
    validateSignupData,
    validateProfileEditData,
}

