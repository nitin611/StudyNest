const mongoose=require('mongoose')

const CourseSchema=new mongoose.Schema({
        courseName:{
            type:String,
            trim:true,
        },
        courseDescription:{
            type:String,
            Trim:true,
        },
        instructor:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
        WhatYouWllLearn:{
            type:String,

        },
        // section ki schema ka refrence->
        CourseContent:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Section"
        }],
        RatingAndReviews:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"RatingAndReview"
        }],
        price:{
            type:Number,
        },
        thumbnail:{
            type:String,
        },
        tag:{
            type:[String],
            required:true
        },
        Category:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Category",
        },
        studentsEnrolled:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        }],
        status:{
            type:String,
            enum:["Draft","Published"],
        }
})

module.exports=mongoose.model("Course",CourseSchema)