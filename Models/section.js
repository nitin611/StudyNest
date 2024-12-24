const mongoose=require('mongoose')
const SubSection = require('./SubSection')

const SectionSchema=new mongoose.Schema({

    name:{
        type:String,
    },
    SubSection:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"SubSection",
        required:true
    }]
})

module.exports=mongoose.model("Section",SectionSchema)