//  to connect to the database - we will be using mongoose
//  we need to do npm i mongoose

const mongoose = require('mongoose');

// connect to the database
// mongoose.connect("databaseConnectionUrl")



// mongoose.connect("mongodb+srv://tanayK:Tanayk@123@cluster0.g4ul5.mongodb.net/")
// note the good way it to wrap inside an async function and await it

const connectDB = async() => {
    // cluster link
    await mongoose.connect(process.env.DB_CONNECTION_SECRET)
    //  after / at the end of the link give teh specific databse you want to give and it will connect to it
    // as cluster can have multiple database
    // here we are connecting to devTinder database
}

// now calling function
// as this function will return promise...we will be using .then and .cath

// the database should be connected forst and then we should connect to the server - using app.listen 
// so we will be exporting connectionDB from here and import it in app.js and will call the below function in app.js

module.exports = connectDB;

// connectDB()
// .then(()=>{
//     console.log("MongoDB Connected...")
// })
// .catch((err)=>{
//     console.error("Database connection failed" , err)
// })




// DevTinder - Database
// user - collection
// and the user.obj in app.js (contents data) - document