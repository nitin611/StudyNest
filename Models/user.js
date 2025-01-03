const mongoose=require('mongoose')
const { resetPasswordToken } = require('../controllers/ResetPassword')

const userSchema=mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true
    },
    lastName:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
       
    },
    accountType:{
        type:String,
        enum:["Admin","Student","Instructor"],
        required:true
    },
    additionalDetails:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Profile",
    },
   courses:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Course"
   }],

   image:{
    type:String,
    required:true
   },
   token:{
    type:String,
   },
   resetPasswordToken:{
    type:Date()
   },
   courseProgress:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"CourseProgress",
    }
   ]


},{Timestamp:true})

module.exports=mongoose.model("user",userSchema)