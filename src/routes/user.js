const express = require ('express');
const { userAuth } = require('../middlewares/auth');
const UserModel = require('../models/user');
const ConnectionRequestModel = require('../models/connectionRequest');

const userRouter = express.Router();

const User_Safe_Data = "firstName lastName photoUrl age gender about skills";

userRouter.get("/user/requests/received" , userAuth , async(req , res)=>{
    // task of this api -  get all the pending(received) connection request for the loggedIn user 

    // 1) Validate if the user is authencated or not - for this add teh userAuth as the middleware

    try{

        const loggedInUser = req.user;

        // 
        const connectionRequest = await ConnectionRequestModel.find({
            toUserId : loggedInUser._id ,
            status : "interested" // we only need where the status is pending..and not all... so we need to specify status
        }).populate("fromUserId","firstName lastName photoUrl age gender about skills ")  // these are the feilds which other people can see ...and we dont want other prople to use email and password
        // }).populate("fromUserId",["firstName", "lastName" ,"photoUrl"])

        res.json(
            {
                message: "Data fetched Successfully",
                data : connectionRequest
            }
        )


    }
    catch(error){
        return res.status(500).send("Error : " + error.message)
    }
})

userRouter.get("/user/connections" ,userAuth , async (req,res)=>{
    // This api will give the connections
    // so if i sent request to arijit and arijit accepts it ..so now this api will give incofmration about who is connected with me 
    // thats is info about who has accepted by connection

    try{
        
        const loggedInUser =  req.user;

        //  now we need to get all the connections of the logged in user
        // example - tanay send request to arijit and the request is in accepted state 
        // so either arijit or tanay can be a sender ..so either of them would be in accepted state ..either tanay accepted it or arijit accepted it 
        // so we query the connectionRequest databae and need to find all the find all connection request where arijit is the toUser or a  fromUser - but should be accepted

        const connectionRequest = await ConnectionRequestModel.find({
            $or :[
                {
                    toUserId : loggedInUser._id,
                    status : "accepted"
                },
                {
                    fromUserId : loggedInUser._id,
                    status : "accepted"
                }
            ]
        })
        .populate("fromUserId", User_Safe_Data)
        .populate("toUserId", User_Safe_Data)
        // we are finding all the connection requests where the toUserId or the fromUserId is a loggedInUser and is acepted

        const data = connectionRequest.map((row)=> {
            if(row.fromUserId._id.toString() === row.toUserId._id.toString()) {
                return row.fromUserId
            }
            return row.fromUserId;
    });

        res.json({
            message: " Data fetched Successfully ",
            data
        })

 
    }
    catch(error){
        return res.status(500).send("Error : " + error.message)
    }
})

userRouter.get("/feed?",userAuth ,async(req,res)=>{
    try{

        // user should not see his own card
        // user should see all the user cards except his own , connection (who has already friend and connected), ignored prople , already sent connection request 

        // Example - 
        // there are 6 user in the database - tanay , akshay , virat , dhoni , arijit , rahul (new user)
        // so now rahul comes to the platform and rahul should be able see everyone expect from him (5 profiles should be visible out of 6)
        // rahul send connection request to akshay ..now rahul should only see 4 profiles and should not able to see his and aksahy profile
        // rahul send connection request to tanay ..now rahul should only see 3 profiles and should not able to see his , aksahy and tanay profile 
        // now lets say akshay rejected the request - so now aksahy should not be shown again
        // and tanay accpeted the request - tanay should not be shown again

        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1 ;  // the req.query.page will be in a string format - we need to convert it into the the int format   or assume the page number is 1

        let limit = parseInt(req.query.limit) || 10 ;  //
        limit = limit > 50 ? 50 : limit ; // if limit is greater than 50 then keep it 50 
        // the page and limit are optional ...user can just hit the /feed api ..so if user is just calling /feed - we will give user the first 10 

        const skip = (page - 1) * limit; // this will skip the first 10 records

        // Finding all connection request ..either accepted , ignored etc (sent +received)
        const connectionRequest = await ConnectionRequestModel.find(
            {
                $or: [
                    {fromUserId : loggedInUser._id},
                    {toUserId : loggedInUser._id }
                ]
            }
        ).select("fromUserId toUserId")
        // .populate("fromUserId" , "firstName")
        // .populate("toUserId" , "firstName")

        const hideUserFromFeed = new Set();
        connectionRequest.forEach((req)=>{
            hideUserFromFeed.add(req.fromUserId.toString()); // w ehave to convert it into string so that only id will be visible
            hideUserFromFeed.add(req.toUserId.toString());
        })
        
        // console.log(hideUserFromFeed)
        // Output -
        // '67e7789d9be69bc8e4c815f5',
        // '67e778709be69bc8e4c815f3',
        // '67d8655f735a6ec3417993a4',
        // '67dde166874b852d2e804fbc'
        // now we need to hide these 4 id...these ids are of rahul loggedInUser , tanay ,  akshay and arijit ...so either rahul haved sent them request or they got request from them and accpted or rejected them ..
        // we have used set so that the fromUserId and toUserId will be stored inside the array - hideUserfromFeed ...any repetion of id will be ignored ..so only the unique will be stored in the array 

        // Remaining users to show in the feed
        const users = await UserModel.find(
            {   
                $and : [
                    
                    {_id : {$nin : Array.from(hideUserFromFeed)}} ,   // $nin - not in this - not be present in array from hideUserFromFeed

                    {_id :{$ne : loggedInUser._id}}   //$ne - not equal to      $and means both the condition in array should be true

                ],
            }
        ).select(User_Safe_Data)
        .skip(skip) // this will skip the first 10 records
        .limit(limit)

        res.send(users)

    }catch(err){
        res.status(400).json(
            {
                message : err.message
            }
        )
    }
})

module.exports = userRouter;