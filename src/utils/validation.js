const validator = require('validator');
const validateSignUpData = (req) =>{

    // We need to validate the request body that has been sent here from app.js


    // taking out all the required fields
    // you can either do the below validatins or either do the validations that we did in last episode in schemas (schema level)

    const {firstName, lastName, emailId , password } = req.body;  //this is javascript object extraction

    if(!firstName || !lastName) {
        throw new Error("First Name and Last Name are required")
    }
    // else if (firstName.legth < 4 || firstName.legth >50) {
    //     throw new Error("First Name and Last Name should be between 4 to 50 characters")
    // }
    else if (! validator.isEmail(emailId)){
        throw new Error("Please enter a valid email")
    }
    else if (! validator.isStrongPassword(password)){
        throw new Error("Password should be atleast 8 characters long and should contain atleast 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character")
    }


}

const validateEditProfileData = (req) =>{
    // allow user only edit to change name 

    const allowedEditFields = ["firstName", "lastName", "emailId" , "photoUrl" , "gender" , "age" , "about" , "skills"]

    const isEditAllowed = Object.keys(req.body).every((field) => allowedEditFields.includes(field))
    // Object.keys(req.body) -> this will give all the keys inside req.body
    // and every feild coming is present in allowedEditFields..if its not presnt then you are not allowed to do update

    // lets say if user is trying to update the passowrd  ...which is not present in the allowedEditFields then it wont be allowed 

    return isEditAllowed;

}
module.exports = {
    validateSignUpData,
    validateEditProfileData
}