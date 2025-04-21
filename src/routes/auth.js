// specific to authorization routes will be present here 

const express = require ('express')

const authRouter = express.Router(); // name can be anything ..you can say router or specify like authRouter

const {validateSignUpData} = require('../utils/validation')
const UserModel = require('../models/user')
const bcrypt = require('bcrypt');


authRouter.post("/signUp" , async (req,res)=>{

    // 1) validation of data (first thing)
    // 2) Encrypt password and store it in database

    // 
    // we will be creating a utils folder and there should be validation.js file
    // validateSignUpData(req)

    // Encrypt password
    // const passwordHash = bcrypt.hash(req.body.password)
    // to hash a password you need some encryption algorithm ...when you do bcrypt.hash it creates a hash using a salt and a plain password
    //  and how many no. of rounds that salt should be applied to create a password
    // more the no. of rounds ..more is the password strong (tough to decrypt)
    // more the encryption level ..then more tough to break tyhe password
    // good number is 10 

    // process of encryption
    // suppose your password is akshay@123 - and now you want to encrypt it
    // you need a salt ...salt is a random string (with letter , numbers and special characters - ldksh@12312$ejhwkw12 )
    // now you take the plain password and salt and you do multiple salt rounds of encryption and more the salt rounds more is the encryption
    // 10 rounds can be a good idea (more the rounds more will be time required to hash a password and also to validate your password it will take time )
    // less number of rounds that means your password is not safe
    // also you can generate salt too using bcrypt.genSalt
    
    // bcrypt.hash(password, saltRounds)  //this will return a promise 

    // await bcrypt.hash(req.body.password, 10)  //this will return a promise




    // _________________________________________________________________

    console.log(req.body)
    // we get the below data - this is the same data we gave inside postman - body- json
    /*
        {
            firstName: 'Hritik',
            lastName: 'Roshan',
            emailId: 'HRK@gmail.com',
            password: 'hrk765@123',
            age: 52,
            phoneNo: '9325614999',
            gender: 'male'
        }
    */





    // logic to add data to the database


    // creating new instance of UserModel

    // const user = new UserModel(userObj)   
    // const user = new UserModel(req.body)   //passing req.doy instead of userObj

    // here we are creating new instance and define userScehma with userObj data

    try{

        validateSignUpData(req)

        const {firstName , lastName , emailId , password ,photoUrl} = req.body;

        const passwordHash = await bcrypt.hash(password ,10 )  //await as it returns promise
        console.log(passwordHash)

        const user = new UserModel(
            {
                firstName , 
                lastName , 
                emailId , 
                password : passwordHash,
                photoUrl : photoUrl || "https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png",
            }
        ) 

        const savedUser = await user.save();

        const token = await savedUser.getJWT();
        
        res.cookie("token", token, {
            expires: new Date(Date.now() + 8 * 3600000),
          })

        res.json({message: "User Created Successfully" ,
            data : savedUser
        })}
    catch(err){
        console.error(err)
        res.send("An error occured" + err.message)
    }
    

    // save is a method that will save the data to the database
    // this will return a promise - so we are using await and make the function async

    // This all steps will add new user to the database
})

authRouter.post("/login" , async (req , res)=>{

    try{
        
        // validation of email id and password

        const {emailId , password} = req.body

        // validate the email id - using validator

        // bcrypt.compare - is used to verify the password
        // bcrypt.compare(password , hash)  // it will return a boolean (promise)
        
        // const isPassordValid = bcrypt.compare("kritiJi765@123" , "$2b$10$T0V1W.33DaverZBqMVj8Y.NlmL5p1Gs3alTyFoxIa7z04juFl1N66")
        // the above will return either true or false 

        // Also before password ..first the email is should be checked ...that whether the email id is present in the database or not
        // and if the email is present in the database then onlt it will check the password 
        
        const user = await UserModel.findOne({emailId : emailId })

        if(! user){
            // throw new Error("Email not found")
            
            throw new Error("Invalid Credentials")

            // also never tell that email is not present in database
            // if you through error that this email is presnt and this email is not presnt then it is called as information leaking
            // if an attacker writes random email ids on database and your database is telling me that this email is present and this email is not present - this is very wrong - so never explicitly write the email is present or not 
            //you need to throw error saying - invalid credentails - so either the email is invalid or password is invalid
        }

        // const isPassordValid = await bcrypt.compare(password , user.password)

        const isPassordValid = await user.validatePassword(password);   

        if(isPassordValid){

            //  here comes the steps for cookies and everthing related to authentication here
            // steps
            // 1) create a jwt token
            // 2) after creating a token ..you will add token to cookie and send the response back to user
            // 3) so as soon as i send cookie to the user ...no wthe user is autheticated automatically ..the token is kind of a them ppassword which will come with every request made by the user to the server


            // cookie
            // res.cookie(name , value )

            // 1) creating a jwt token

            // const token = await jwt.sign(hide , secret) //hiding userId we are hidding information under this token and the second parameter is the secret key..the secret key is the password that only you (server) knows 
            // const token = await jwt.sign({_id: user._id} , "DEV_TINDER@123" , {expiresIn : "7d"}) //hiding userId we are hidding information under this token and the second parameter is the secret key..the secret key is the password that only you (server) knows 
            // token will expire in 1 day

            const token = await user.getJWT();
            // we are using above code as we have used schema methods for jwt.sign
            // and we have already taken isnatnce of user on line 155...we are simply going to do user.getJWT (as we have created getJWT in SECHMA METHODS)


            // res.cookie("token" , "ndshbfresudidrwjkglfnsbvfdsibvdjksnclk")
            res.cookie("token" , token ) // here we are sending back the token to the user

            // res.cookie("token" , token , {expires:new Date(Date.now()+ 1 * 360000)}) // here we are sending back the token to the user
            // cookie will expire in 1 hour

            // so when the user is coming with teh emailId and password and if the email id and password is correct then
            // we first created a jwt token 
            // hiding te user id inside it 
            // and then we sent back token to the user

            res.send(user)
        }
        else{
            // throw new Error ("Invalid Password")
            throw new Error ("Invalid Credentials")
        }

        


    }
    catch(err){
        console.error(err)
        res.send("An error occured" + err.message)
    }
})

authRouter.post("/logout" , async(req,res)=>{
    // logic for logout

    res.cookie("token", null ,{expires: new Date(Date.now())}) 
    // here wa are sending token as null
    // also the expiration time of the cookie is current time
    
    // token will be null and the user will not be authenticated anymore
    res.send("Logged Out Successfully")


} )

module.exports = authRouter; 


// note
// app.use   - const app = express();
// router.use - const router =express.Router()
// both are same works same


// you can chain method in res
// res
//     .cookie(.....)
//     .send()

// you dont need to write res again...just write .send or .cookie     etc

// in big comapies the logout route has the clean up activites from the database
// as we have small project we dont need complex logout ...we just need to expire teh cookie 
// mostly logout api are simple