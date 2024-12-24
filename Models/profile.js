const mongoose=require('mongoose')

const profileSchema=new mongoose.Schema({
    gender:{
        type:String,

    },
    dateOfBirth:{
        type:String,
    },
    about:{
        type:String,
        trim:True
    },
    contactNumber:{
        type:String,
        trim:True
    }

})
module.exports=mongoose.model("Profile",profileSchema)