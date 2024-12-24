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
        CourseContent:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Section"
        }],
        RatingAndRevies:[{
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
            type:mongoose.Schema.Types.ObjectId,
            ref:"Tag",
        },
        studentsEnrolled:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        }]
})

module.exports=mongoose.model("Course",CourseSchema)