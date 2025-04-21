const express = require('express')

const app = express();

const connectDB = require('./config/database')

const UserModel = require('./models/user')

// validation
const {validateSignUpData} = require('./utils/validation')

// bcrypt
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser'); //cookie parser is basically used to read the cookeis
const jwt = require('jsonwebtoken');
const { userAuth } = require('./middlewares/auth');
const cors = require('cors')

require("dotenv").config();

const port = process.env.PORT

// middleware 
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))
app.use(express.json())  //this middlware will be for all routes

app.use(cookieParser())

const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request");
const userRouter = require('./routes/user');

app.use("/" , authRouter)
app.use("/" , profileRouter)
app.use("/" , requestRouter)  
app.use("/" , userRouter)  

// app.post("/signUp" , async (req,res)=>{

//     // 1) validation of data (first thing)
//     // 2) Encrypt password and store it in database

//     // 
//     // we will be creating a utils folder and there should be validation.js file
//     // validateSignUpData(req)

//     // Encrypt password
//     // const passwordHash = bcrypt.hash(req.body.password)
//     // to hash a password you need some encryption algorithm ...when you do bcrypt.hash it creates a hash using a salt and a plain password
//     //  and how many no. of rounds that salt should be applied to create a password
//     // more the no. of rounds ..more is the password strong (tough to decrypt)
//     // more the encryption level ..then more tough to break tyhe password
//     // good number is 10 

//     // process of encryption
//     // suppose your password is akshay@123 - and now you want to encrypt it
//     // you need a salt ...salt is a random string (with letter , numbers and special characters - ldksh@12312$ejhwkw12 )
//     // now you take the plain password and salt and you do multiple salt rounds of encryption and more the salt rounds more is the encryption
//     // 10 rounds can be a good idea (more the rounds more will be time required to hash a password and also to validate your password it will take time )
//     // less number of rounds that means your password is not safe
//     // also you can generate salt too using bcrypt.genSalt
    
//     // bcrypt.hash(password, saltRounds)  //this will return a promise 

//     // await bcrypt.hash(req.body.password, 10)  //this will return a promise




//     // _________________________________________________________________

//     console.log(req.body)
//     // we get the below data - this is the same data we gave inside postman - body- json
//     /*
//         {
//             firstName: 'Hritik',
//             lastName: 'Roshan',
//             emailId: 'HRK@gmail.com',
//             password: 'hrk765@123',
//             age: 52,
//             phoneNo: '9325614999',
//             gender: 'male'
//         }
//     */





//     // logic to add data to the database

//     // the req.body that we used is same as the data we are passing in from here below ...so instead of passing userObj we will be passing req.body
//     // const userObj = { 
//     //     firstName : "M S",
//     //     lastName : "Dhoni",
//     //     emailId : "mahindra12@gmail.com",
//     //     password : "ms@123",
//     //     age : 45,
//     //     phoneNo : "9999854999",
//     //     gender: "male",
//     // }


//     // creating new instance of UserModel

//     // const user = new UserModel(userObj)   
//     // const user = new UserModel(req.body)   //passing req.doy instead of userObj

//     // here we are creating new instance and define userScehma with userObj data

//     try{

//         validateSignUpData(req)

//         const {firstName , lastName , emailId , password} = req.body;

//         const passwordHash = await bcrypt.hash(password ,10 )  //await as it returns promise
//         console.log(passwordHash)

//         const user = new UserModel(
//             {
//                 firstName , 
//                 lastName , 
//                 emailId , 
//                 password : passwordHash
//             }
//         ) 

//         await user.save();

//         res.send("User Created Successfully")
        
//     }
//     catch(err){
//         console.error(err)
//         res.send("An error occured" + err.message)
//     }
    

//     // save is a method that will save the data to the database
//     // this will return a promise - so we are using await and make the function async

//     // res.send("User Created Successfully")

//     // This all steps will add new user to the database
// })


// app.post("/login" , async (req , res)=>{

//     try{
        
//         // validation of email id and password

//         const {emailId , password} = req.body

//         // validate the email id - using validator

//         // bcrypt.compare - is used to verify the password
//         // bcrypt.compare(password , hash)  // it will return a boolean (promise)
        
//         // const isPassordValid = bcrypt.compare("kritiJi765@123" , "$2b$10$T0V1W.33DaverZBqMVj8Y.NlmL5p1Gs3alTyFoxIa7z04juFl1N66")
//         // the above will return either true or false 

//         // Also before password ..first the email is should be checked ...that whether the email id is present in the database or not
//         // and if the email is present in the database then onlt it will check the password 
        
//         const user = await UserModel.findOne({emailId : emailId })

//         if(! user){
//             // throw new Error("Email not found")
            
//             throw new Error("Invalid Credentials")

//             // also never tell that email is not present in database
//             // if you through error that this email is presnt and this email is not presnt then it is called as information leaking
//             // if an attacker writes random email ids on database and your database is telling me that this email is present and this email is not present - this is very wrong - so never explicitly write the email is present or not 
//             //you need to throw error saying - invalid credentails - so either the email is invalid or password is invalid
//         }

//         // const isPassordValid = await bcrypt.compare(password , user.password)

//         const isPassordValid = await user.validatePassword

//         if(isPassordValid){

//             //  here comes the steps for cookies and everthing related to authentication here
//             // steps
//             // 1) create a jwt token
//             // 2) after creating a token ..you will add token to cookie and send the response back to user
//             // 3) so as soon as i send cookie to the user ...no wthe user is autheticated automatically ..the token is kind of a them ppassword which will come with every request made by the user to the server


//             // cookie
//             // res.cookie(name , value )

//             // 1) creating a jwt token

//             // const token = await jwt.sign(hide , secret) //hiding userId we are hidding information under this token and the second parameter is the secret key..the secret key is the password that only you (server) knows 
//             // const token = await jwt.sign({_id: user._id} , "DEV_TINDER@123" , {expiresIn : "7d"}) //hiding userId we are hidding information under this token and the second parameter is the secret key..the secret key is the password that only you (server) knows 
//             // token will expire in 1 day

//             const token = await user.getJWT();
//             // we are using above code as we have used schema methods for jwt.sign
//             // and we have already taken isnatnce of user on line 155...we are simply going to do user.getJWT (as we have created getJWT in SECHMA METHODS)


//             // res.cookie("token" , "ndshbfresudidrwjkglfnsbvfdsibvdjksnclk")
//             res.cookie("token" , token ) // here we are sending back the token to the user

//             // res.cookie("token" , token , {expires:new Date(Date.now()+ 1 * 360000)}) // here we are sending back the token to the user
//             // cookie will expire in 1 hour

//             // so when the user is coming with teh emailId and password and if the email id and password is correct then
//             // we first created a jwt token 
//             // hiding te user id inside it 
//             // and then we sent back token to the user

//             res.send("Login Successful")
//         }
//         else{
//             // throw new Error ("Invalid Password")
//             throw new Error ("Invalid Credentials")
//         }

        


//     }
//     catch(err){
//         console.error(err)
//         res.send("An error occured" + err.message)
//     }
// })

// Profile api
// app.get("/profile", userAuth , async (req,res)=>{

   
//     try {
// /*
//     // when user hit /profile api we(Server) want to validate the cookie that user has sent with the request 

//     // validation of cookie

//     // get cookie
//     const cookie = req.cookies;   // this wiil give you all the cookies

//     console.log(cookie) //this will print - undefined ....this doesnt read the cookie

//     // to read the cookie need a npm library (middleware) called - cookie parser

//     // so keep in mind when you want to read a cookie you need parse it and then you can read it - cookie parser

//     // its similar to - app.use(express.json()) - middleware
//     // we used express.json as whenever I am reading the request I want that datat to be parsed inside json and then want to get it

//     // similarly we want to read a cookie now for that we nedd a middleware - cookie parser

//     // app.use(cookieParser());

//     const {token} = cookie;

//     // error handling
//     if(!token){
//         return res.send("Unauthorized - Invalid Token")
//     }


//     // Now validating
//     // const isTokenValid = await jwt.verify(token ,secret Key)
//     const decodedMessage = await jwt.verify(token , "DEV_TINDER@123")

//     // console.log(decodedMessage)  // { _id: '67d8655f735a6ec3417993a4', iat: 1742326422 }   ... this decoded msg is the id 

//     const {_id} = decodedMessage  //extracting id from the decodedMessage

//     console.log("LoggedIn user :" + _id)
// */
// // above code is written in auth middleware


//     // const user = await UserModel.findById(_id)

//     // now as we have already found teh user in the auth middleware and we have passe dit in req.user (req.user = user)
//     // so we will be just doing 
//     const user = await req.user   //instead of line 263 we are writing this 

//     // if token is valid but user doesnt exists
// /*    if(!user){
//         throw new Error("Unauthorized - User Doesn't Exists!!!")
//     }
// */
//     res.send(user)

// }
//     catch(err){
//         console.error(err)
//         res.status(400).send("An error occured" + err.message)
//     }


// })

// Send Connection request
// app.post("/request" , userAuth , async (req,res) =>{

//     // we want this api to be hit by user - only when they are LOGGED IN
//     // to make this happen 
//     // just add the auth (middleware) in the api - here - userAuth

//     // jus by adding this middleware this becomes secure

//     // so now this api only work when the user is logged in 

//     const user = req.user;


//     console.log("Sending Connection Request")
//     res.send(user.firstName + "sent the connection request")

// })

/*
app.get('/feed' , async(req,res) =>{
    // feed api gets all the users from the database


    // How to get data from the database

    // when you want to get the data from the database - you should know the model that you want to use and what are you getting from the database

    // Here we want to find a model ...so we will be using - model.find()
    // find function takes a filter
    // UserModel.find()
    // find is used to get all the data with same ...like if email id is 2 or more taht is same then using Find we can get all ..... it will give you an array
    //  but by using Find.one method we will get only the one data ..the one created first it will find that .. (if there is multiple present) ..... it wont give an array..

    try{
        // Find
        const user = await UserModel.find({});

        // Find.One
        // const user = await UserModel.findOne({});
        // if you pass empty filter it will give you all the documnets from the collection in the model
        // res.send(user)

        // handling error
        if(user.length === 0){
            res.status(404).send("User not found");
        }
        else{
            res.send(user);
        }
    }
    catch(err){
        console.error(err)
        res.send("An error occured")
    }
    
})
*/

 // suppose - get user by emailId
/*
 app.get("/user" , async(req,res)=>{

    const userEmail = req.body.emailId;

    try{
        const user = await UserModel.find({emailId : userEmail })

        // can also write 
        // const user = await UserModel.find({emailId : req.body.emailId })
        // res.send(user)

        // handling error
        if(user.length === 0){
            res.status(404).send("User not found");
        }
        else{
            res.send(user);
        }
    }
    catch(err){
        console.error(err)
        res.send("An error occured")
    }

    

    
 })
*/


//  DELETE a user
/*
app.delete("/user" , async(req,res)=>{
    // Reading the userId

    const userId = req.body.userId;

    try{
        const user = await UserModel.findByIdAndDelete(userId);
        // above is the short hand for the below code 
        // const user = await UserModel.findById({_id: userId});

        res.send("User Deleted Successfully")
    }
    catch(err){
        console.error(err)
        res.status(400).send("An error occured")
    }


}) 
*/

// UPDATE USER

/*
app.patch("/user", async (req,res)=>{

    // findByIdAndUpdate and findOneandUpdate both are the same
    // only difference is that findByIdAndUpdatetake id and WILL update things 
    // while findOneandUpdate can take other fields than id too 

    // read the documentation
    // UserModel.findByIdAndUpdate(id, updates, options)

    const userId = req.body.userId;
    const data = req.body;

    try{
        const user = await UserModel.findByIdAndUpdate({_id: userId} ,data ,{
           runValidators:true, 
        });  //the data here si the updated value that will come from api from postman using json body (req.body)
        res.send("User Updated Successfully")
    }
    catch(err){
        console.error(err)
        res.status(400).send("Updating Failed" +  err.message)
    }

})
*/
 



connectDB()
.then(()=>{
    // once the db connection is successful then we will start the server

    console.log("MongoDB Connected...")

    app.listen(port , ()=>{
        console.log(`Server is running on port : ${port}`)
    })
})
.catch((err)=>{
    console.error("Database connection failed" , err)
})

// app.listen(3000 , ()=>{
//     console.log("Server is running on port 3000")
// })

// AWAYS FIRST CONNECT TO THE DATABASE AND THEN START THE SERVER USING app.listen 
// START THE SERVER ONLY AFTER CONNECTING TO THE DATABASE





// DevTinder - Database
// user - collection
// and the user.obj in app.js (contents data) - document
// user.obj has fields 



// This is javascript object

// const userObj = { 
//     firstName : "M S",
//     lastName : "Dhoni",
//     emailId : "mahindra12@gmail.com",
// }



// This is json object

// { 
//     "firstName" : "M S",
//     "lastName" : "Dhoni",
//     "emailId" : "mahindra12@gmail.com"
// }

// here in json object both th ekey and object are in " "
// and this cant take . at the last


// _______________________________________________________________

// when you do console.log(req) - >  doing this we get lot of req object on the console
//          so when we say req (req is the request object)...thats the whole req that postman has sent to us (there are lots of requests)...
//          postman sents request then server receives request and this request is converted to object by express for us using

//           also the data sent by use via postman -> body -> josn ...is also the part of req
//           so we can access that data using req.body - as we want to access that specific data

//           -  console.log(req.body) but this gets undefined in console (this is because the data we are passing in json format and our server is not able to read that json data  )
//           to read that data we need middleware (middleware tht checks the incoming request -> read that json and convert it into javascript object and put that into the body and can give access to the data using - req.body  ) we need to use this middleware for all apis

//  express json middleware - we can use this middleware