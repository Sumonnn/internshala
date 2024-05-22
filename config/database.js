const mongoose = require("mongoose");
require("dotenv").config();

exports.DBconnect = ()=>{
    mongoose
        .connect(process.env.MONGODB_URL)
        .then(()=>console.log("DB connected successfully!!"))
        .catch((err)=>console.log(err))
}