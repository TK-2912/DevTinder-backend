const express = require('express')

const requestRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequestModel = require('../models/connectionRequest');
const UserModel = require('../models/user');

requestRouter.post("/request/send/:status/:toUserId" , userAuth , async (req,res) =>{

    try{    

        // req.user is a logged in user

        const fromUserId = req.user._id

        const toUserId = req.params.toUserId
        // toUsrId will come form params 

        const status = req.params.status
        // status we will get from api here (while sending connection request) - interested
        // we can use the same api for left swipe and right swipe
        // we can make the status - api route dyanmic - so it can either be ignored or interested
        //   /request/send/:status/:toUserId   -> status is dynamic - either interested or ignored ...also toUserId is dyamic (the receivers id will be there )


        // Validation
        // the fromUser (the user that is sending request to other - can only used /interested and /ignored    and not fro /accepted )  ...that is the user can either right swipe(accept) or left swipe (ignore)
        // we wont allow to accepted request by themselves using /request/send/accepted/:toUserId    - we need to restrict the user 

        const allowedStatus = ["ignored", "interested"];

        
        if(! allowedStatus.includes(status)){
            // so if allowedStatus.includes is false the only it will throw the error
            // we will send error reponse 

            return res.status(400).json({message : "Invalid Status Type :" + status})
            // if you write written the code wont move to the next line ..and thats what we want ...the code stop stop there
            // if you dont write return ..it will throw the error and will also run the next line code which we dont want
        }
        // if status is true it will run below code

        // we shoud never rely on req.params or bs=asically req.body as these data is coming user and atacker cans end anything req from here 




        // now checking if there is an existing connection request
        const existingConnectionRequest = await ConnectionRequestModel.findOne({
            $or : [
                    {
                        fromUserId,
                        toUserId
                    },
                    {
                        fromUserId: toUserId,
                        toUserId: fromUserId
                    }
            ]
        });
        // $or is or condition in mongodb
        // it is finding in the connection request database that -
        // if fromUserId and toUserId are already exist (it checks if akshay(fromUserId) and elon musk (toUserId) id entry is already present in teh db)
        // or check
        // if fromUserId is toUserId and toUserId is FromUserId

        if(existingConnectionRequest){
            return res.status(400).send("Connection request already exists")
        }
        // this above code makes sure that if akshay has sent request to elon once ..he cannot send request again (no duplicate connection request)

        


        // a user cant send request to himself - that is fromUserId and toUserId cant be same while sending request
        // if(String(toUserId) === String(fromUserId)){
        //     return res.status(400).send("You cannot send connection request to yourself")
        // }

        // you can either use above code or the code written in connection request model - pre 
        // the above code is much preferable but you can use pre one too
    


 
        // Checking toUserId is genuin eor fake (Random)
        const toUser = await UserModel.findById(toUserId);
        if(!toUser){
            return res.status(400).json({message: 'User not found'})
        }


 
        const connectionRequest = new ConnectionRequestModel(
            {
                fromUserId,
                toUserId,
                status
            }
        )
        // above is the new instance of ConnectionRequestModel - the model getting exported from the model-connectionRequest

        const data = await connectionRequest.save()
        // now we have to save it

        res.json(
            {
                message: req.user.firstName + " " +  status + " " + toUser.firstName ,
                data
            }
        )
    }
    catch(err){
        console.error(err)
        res.status(400).send("An error occured" + err.message)
    }















// _______________________________________________________________

// Old code 

    // we want this api to be hit by user - only when they are LOGGED IN
    // to make this happen 
    // just add the auth (middleware) in the api - here - userAuth

    // jus by adding this middleware this becomes secure

    // so now this api only work when the user is logged in 

/*
    const user = req.user;


    console.log("Sending Connection Request")
    res.send(user.firstName + "sent the connection request")

*/
    // _________________________________________________________________

})

requestRouter.post("/request/review/:status/:requestId" , userAuth , async (req,res)=>{
    // userAuth will check the cookie is there or not and token is valid or not and then it will find oit the information about the loggedin user and will get the loggedin user in the database and it will call next()

    try{
        const loggedInUser = req.user  //req.user we got from userAuth middleware

        const {status , requestId} = req.params;


        // aksahy sending connection request to elon 

        // step 1) // validation on the status - 
        // step 2) we need to check is elon the logged in user ...only elon can accept the request ...api should only work if the logged in user is elon - only toUserId person can accept the request
        // so the toUserId should be logged in and the status should be interested
        // request id should be valid

        // also if the user rejects / ignores then there is no way of going back it will be rejected you cant change that...not fromUserId nor the toUserId (once you left swipe ..then you cant right swipe again)

        
        
        
        
        // 1) Validating status

        const allowedStatus = ["accepted" , "rejected"]
        
        if(!allowedStatus.includes(status)){ //status is from req.aparams ...basically written by user in api call
            return res.status(400).json(
                {message: "Inavlid Status"}
            )
        }


        // Checking if the request id is correct or not 
        const connectionRequest = await ConnectionRequestModel.findOne({
            _id: requestId,
            toUserId : loggedInUser._id,
            status: "interested", 
        })

        if(!connectionRequest){
            return res.status(400).json(
                {
                    message: 'Connection Request not found'
                }
            )
        }

        connectionRequest.status = status;
        // now the status chnage ...either accepted or rejected (based on what toUserId (Elon) needs to be changes

        const data = await connectionRequest.save()
        // after the status change you need to save the changes in the  - save the api

        res.json(
            {
                message : "Connection request " + status ,
                data //sending data back
            }
        )

    }
    catch(err){
        console.error(err)
        res.status(400).send("An error occured" + err.message)
    }
} )



module.exports = requestRouter;