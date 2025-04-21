const mongoose = require ('mongoose')

const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId:{
                        type: mongoose.Schema.Types.ObjectId,  //type will be a id
                        ref : "User", //reference to the user collection
                        required: true

                   },

        toUserId:{
                        type: mongoose.Schema.Types.ObjectId,  //type will be a id
                        ref : "User",
                        required: true

                   },

        status : {
                    type : String,
                    enum :  {
                                values : ['ignored' , 'interested' , 'accepted' , 'rejected' ] ,  // we sue enum when we want to restict user for some value...here we only want status should have certain values such as ignored (pass) , interested (like) , accepted , rejected  ...anything else should thow an error
                                message : `{VALUE} is incorrect status type`  //custom error message - custom validatores
                            },
                    required: true
                }
    
    },
    {
        timestamps : true,  // this will add two fields - createdAt and updatedAt - automatically
    }
)


//  we can do similar enum in gender too 
// values: [ 'male', 'female', 'others']
// message: `{VALUE} is not a valid gender type

// so you can use the validator function (validaton.js) or use th enum 
// or can use both 




// COMPOUND INDEX
connectionRequestSchema.index({fromUserId:1 , toUserId:1})  // assending order
// connectionRequestSchema.index({fromUserId:-1})  // desending order

// compound index means when you will query will both the fromUserId and toUserId parameters - combined - then these query will become very fast


connectionRequestSchema.pre("save" , function(next){
    const connectionRequest = this
    // this is kind of like middleware...it will be called everytime when connection request will be saved ...so anytime when you are saving the connection request this pre will be called
    // so whenever you call a save method (in request router file )we have used connectionRequest.save - this is used to save this in mongodb database..so as its name is pre...this will be called before saving it in the database (pre save)
    
    // so before saving in to the database this pre will make sure that the fromUserId and toUserId is not same

    // check if fromUserId and toUserId are same
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Not allowed !!! Cant send request to self")
    }

    next(); // use next so that code can move ahead at will save it in database
    
})
// this pre middleware will take save and a function
// the function should always be write in normal function ..and not a arrow function
// so whenever you write a schema method or pre function always write normal function ...arrow function wont work



const ConnectionRequestModel = new mongoose.model("ConnectionRequest", connectionRequestSchema)

module.exports = ConnectionRequestModel