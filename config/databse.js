const mongoose=require('mongoose')
const dotend=require('dotenv')
require("dotenv").config

exports.connect=()=>{
    mongoose.connect(process.env.MONGOOSE_URL)
    .then(()=>console.log("Mongodb connected successfully"))
    .catch((error)=>{
        console.log("Error in db connection")
        console.error(error)
        process.exit(1)
    });
};