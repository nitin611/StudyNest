const mongoose=require('mongoose');
const mailSender = require('../utils/mailSender');

const otpSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,

    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60,
    }
});

// DB ME ENTRY SAVE HONE SE PEHLE MAIL BHEJO user ko and verify the user then create instance in the db
// of the user, so first verify the otp then create entry in the db.

//-------------------- otp verification logic here-pre-middleware logic--------------------------
otpSchema.pre("save",async function(next){
    await sendVerificationEmail(this.email,this.otp);
    next();
})


async function sendVerificationEmail(email,otp){
    try {
        const mailResponse=await mailSender(email,"Verification Email from StudyNest",otp);
        console.log("Email sent successfully",mailResponse)
    } catch (error) {
        console.log("Error occured while sending emails",error)
        throw error
    }
}




module.exports=mongoose.model("OTP",otpSchema)