const mongoose = require("mongoose")

const dbConnect = () =>{
    try{
    mongoose.set("strictQuery", false);
    const con =  mongoose.connect("mongodb://localhost:27017/Apacher")
    console.log("database connected successfully")
    }
    catch(error)
    {
        console.log("Database error")
    }

}

module.exports = dbConnect

