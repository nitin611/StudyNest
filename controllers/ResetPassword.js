const User=require('../Models/user')
const mailSender=require('../utils/mailSender')
const bcrypt=require('bcrypt')


// resetPasswordToekn-
exports.resetPasswordToken=async(req,res)=>{

      try {
          // get email from req.body-
          const email=req.body

          // check if email validation and user exist with this email-
              const user=await User.findOne({email})
              if(!user){
                  return res.status(401).send({
                      success:false,
                      msg:"Your email is not registered with us"
                  })
              }
  
          // generate Token- also give expirey time for the token-
              const token=crypto.randomUUID();
  
          // update user by adding token and expiration time-
              const updatedDetails=await User.findOneAndUpdate(
                                                          {email:email},{
                                                              token:token,
                                                              resetPasswordExpires:Date.now()+5*60*1000,
                                                          },{new:true})
  
          // create the url-
           const url=`http://localhost:3000/update-password/${token}`
          // generate link - jaise jaise token change hoga ye link change hote rahega-
         
  
  
          // send mail containing the url-
          await mailSender(email,
                       "Password Reset Link",
                          `Password Reset link: ${url}`)
          // return the response-
          return res.status(200).send({
              success:true,
              msg:"Email sent successfully, check the mail and Reset Your Password"
          });
  
      } catch (err) {
        console.log(err)
        res.status(500).send({
            success:false,
            msg:'Error in resetPassword'
        })
      }
}


// jab user link pe click karega to ish api pe call hoga jab reset password 
// resetPassword-
exports.resetPassword=async(req,res)=>{
    try {
        // data fetch->take user input-token,password,confirm password-
        const {password,confirmPassword,token}=req.body
        // validation karo-
        if(password!==confirmPassword){
            return res.json({
                success:false,
                msg:"Password and confirmPassword is not matching"
            })
        }
         // user ke andar token ish liye daale and model me taki baad me ush token se user ka detail fetch kar sake 

        // get userDetails from db via token-
        const userDetails=await User.findOne({token:token})
        // if no entry found-invalid token || 
        if(!userDetails){
           return res.json({
                success:false,
                msg:"Token is invalid"
            });
        }
        // check token expirey time-agar ye token current time se bara hogaya to expire ho chuka ho
            if(userDetails.resetPasswordExpires<Date.now()){
                return res.json({
                    success:false,
                    msg:'Token is expired, please Re-generate your token'
                })
            }
        // password ko hash karo-
        const hashedPassword=await bcrypt.hash(password,10);

        // update user password in the database-
        await User.findOneAndUpdate(
            {token:token},
            {password:hashedPassword},
            {new:true});
        // return result-
        return res.status(200).send({
            success:true,
            msg:'Password reset successfully'
        })
    }
     catch (err) {
        console.log(err)
        return res.status(500).send({
            success:false,
            msg:'Error in resetting the password'
        })
    }
}