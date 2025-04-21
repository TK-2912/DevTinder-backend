const express = require('express')

const profileRouter = express.Router()

const UserModel = require('../models/user')
const cookieParser = require('cookie-parser'); //cookie parser is basically used to read the cookeis
const jwt = require('jsonwebtoken');
const { userAuth } = require('../middlewares/auth');
const { validateEditProfileData } = require('../utils/validation');

profileRouter.get("/profile/view", userAuth , async (req,res)=>{

   
    try {
/*
    // when user hit /profile api we(Server) want to validate the cookie that user has sent with the request 

    // validation of cookie

    // get cookie
    const cookie = req.cookies;   // this wiil give you all the cookies

    console.log(cookie) //this will print - undefined ....this doesnt read the cookie

    // to read the cookie need a npm library (middleware) called - cookie parser

    // so keep in mind when you want to read a cookie you need parse it and then you can read it - cookie parser

    // its similar to - app.use(express.json()) - middleware
    // we used express.json as whenever I am reading the request I want that datat to be parsed inside json and then want to get it

    // similarly we want to read a cookie now for that we nedd a middleware - cookie parser

    // app.use(cookieParser());

    const {token} = cookie;

    // error handling
    if(!token){
        return res.send("Unauthorized - Invalid Token")
    }


    // Now validating
    // const isTokenValid = await jwt.verify(token ,secret Key)
    const decodedMessage = await jwt.verify(token , "DEV_TINDER@123")

    // console.log(decodedMessage)  // { _id: '67d8655f735a6ec3417993a4', iat: 1742326422 }   ... this decoded msg is the id 

    const {_id} = decodedMessage  //extracting id from the decodedMessage

    console.log("LoggedIn user :" + _id)
*/
// above code is written in auth middleware


    // const user = await UserModel.findById(_id)

    // now as we have already found teh user in the auth middleware and we have passe dit in req.user (req.user = user)
    // so we will be just doing 
    const user = await req.user   //instead of line 263 we are writing this 

    // if token is valid but user doesnt exists
/*    if(!user){
        throw new Error("Unauthorized - User Doesn't Exists!!!")
    }
*/
    res.send(user)

}
    catch(err){
        console.error(err)
        res.status(400).send("An error occured" + err.message)
    }


})

profileRouter.patch("/profile/edit" , userAuth , async(req,res)=>{
    // edit
    try{
        if(!validateEditProfileData(req)){
            // return res.status(400).send("Invalid Data")
            // or
            throw new Error("Invalid Data")
        }

        const loggedInUser = req.user;

        // Before change
        // console.log(loggedInUser)

        // loggedInUser.firstName = req.body.firstName 
        
        // we are adding the req.body.firstName (new Updated data by user) to the loggedInUser (into the database)

        Object.keys(req.body).forEach((key)=>loggedInUser[key] = req.body[key]);


        // After change
        // console.log(loggedInUser)

        // Save changes
        await loggedInUser.save()
        // always use await

        
        // res.send(loggedInUser.firstName + " Your Profile Updated Successfully")
        // OR
        // res.send(` ${loggedInUser.firstName} , Your Profile Updated Successfully`)
        res.json({message : `${loggedInUser.firstName} , Your Profile Updated Successfully` , data:loggedInUser})

        // Above is the best way ro send res
        // the actual api resonse is like this only and not using res.send (its normal text)
        
    }
    catch(err){
        console.error(err)
        res.status(500).send("An error occured")
    }
})

module.exports = profileRouter