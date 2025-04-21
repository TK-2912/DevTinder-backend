// first we will create a schema and then we will create a model

// for creating a schema
// create a folder named- models (in src)
// create a file named- user.js (in models)

// in this file we will define what user in our database is and its fileds (all about user collection)

// ______________________________________________

// 1) require mongoose 
const mongoose = require ('mongoose');

// this below code is realted to schema methods 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// 2) create a schema
const userSchema = new mongoose.Schema(
    {
        //  this will contains all the parametrs that define a user
        firstName : {
                        type : String,
                        required : true ,  //required takes boolean
                        minLength : 4 ,
                        maxLength : 50,
                        
                    },
                    
        lastName : {
                        type : String,
                    },

        emailId :   {
                        type : String,
                        required : true,
                        unique : true, //either gauve unique or index : true ...to give index 
                        trim : true,
                    },

        password : {
                        type : String,
                        required : true
                    },

        age       : {
                        type : Number,
                        min : 18,
                    },

        gender : {
                        type : String,
                        // custom validation function
                        validate(value) {
                            if(!["male", "female" , "others"].includes(value)){  //if value doesnt include male or frmale or others then throw error
                                throw new Error("Invalid Gender")
                            }
                        }
                        // this validate method will only be called (will check if the gender is male , femlae or other) when we are inserting data for the first time (that is when signUp) 
                        // this wont work when we do patch (update the value of the already present data)
                    },
        photoUrl : {
                        type : String,

        },
        about : {
            type : String ,
            default : "This is the deafault about the user"

        },
        skills : {
            type : [String]
        }

    }
    ,
    {
        timestamps : true  // mongodb will store the time when the user is created 
    }
)


userSchema.methods.getJWT = async function(){
    // writing code for jwt.sign here

    const user = this; //instance

    const token = await jwt.sign({_id: user._id} , "DEV_TINDER@123" , {expiresIn : "7d"});

    return token;
}
// dont use arrow functions here as it will break things
//  as we are using "this" so if you use arrow function it has different implementation...we need to only use normal function


userSchema.methods.validatePassword = async function (passwordInputByUser){
    const user = this;
    const passwordHash = user.password

    const isPasswordValid = await bcrypt.compare(passwordInputByUser , passwordHash)
    //                                           (this is password entered by the user , hashed password (psswordHash)

    return isPasswordValid;
}

// After creating a schema we will create a mongoose model

// 3) create a model

// mongoose.model("nameOfTheModel" , schema )

const UserModel = mongoose.model("User" , userSchema)



// 4) export the model

module.exports = UserModel;

// or can directly write step 3 and 4 together
    // module.exports = mongoose.model("User" , userSchema)

// ______________________________________________

// FIRST WE CREATED A USER SCHEMA
    // - require mongoose from mongoose library

// THEN WE CREATED A USER SCHEMA - 
    // - created a schema using mongoose.schema
    // - defined all the fields that a user will have
    // - all the fields are required


// THEN WE CREATED A USER MODEL
    // const UserModel = mongoose.model("nameOfTheModel" , schema )

    // NOTE
    // when you are referencing to model - keep the first letter capital
    // const UserModel = mongoose.model("User" , userSchema)



