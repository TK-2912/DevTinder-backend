const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');
const userAuth = async(req,res,next) =>{

try{
    // job of middleware is to read the token from the req cookies , 
    // validate the token
    // find the user 

    // reading cookies
    // const cookies = req.cookies;

    // find the token from the cookies
    // const {token} = cookies; 

    // you can also combine first and second step
    const {token} = req.cookies;  
    // this means from cookies (req.cookies) we are extracting token

    if(!token){
        return res.status(401).send("Please Login !!!")
    }

    // verify
    const decodedMessage = await jwt.verify(token , "DEV_TINDER@123") 
    // note we would be keeping the jwt secret at .env file like below
    // const decodedObj = await jwt.verify(token , process.env.JWT_SECRET )  

    const {_id} = decodedMessage 
    

    // find the user
    const user = await UserModel.findById(_id)

    if(!user) {
        res.status(401).send({error : "User not found"})
    }

    // when you find the user then attach it to the req obj  - req.user
    req.user = user; 

    // if the user is not present then next will be called  (as this is middleware we are using next)
    // next is called to move to the request handler
    next();
}

catch(err){

    res.status(400).send("ERROR: " + err.message)
}
};

module.exports = {
    userAuth
}

// how the above middleware will work and how the request will be handled

// if suppose someone calls /profile api 
// it will first of all will go to userAuth api and will run all the code
//  it will run all the code in the api - it will check for the token -> if token is there then it will verify the token  -> and will find the user 
// if the user is not found it will throw the error
// and if everything goes well then call the next 

//  when we call the next - then it will call the function (api that has the middleware ) - here we have profile api having the middleware