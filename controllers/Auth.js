const user=require('../Models/user')
const OTP=require('../Models/OTP')
const otpGenerator=require('otp-generator')
const jwt=require('jsonwebtoken')
const Profile=require('../Models/profile')



// otp send
// flow of otp -
// 1.)req.body me se email lo check if user already exist ->yes then return user to login page.
// 2.) No then->otp generate->otp store to db also
// 3.) match the otp of user and from db if both are equal create user instance in the db-

exports.sendOTP=async(req,res)=>{

    try {
 // fetch email from request ki body
    const {email}=req.body

    // check if user already exist-
    const checkUserPresent=await user.findOne({email});
    // if user already exist then return the user-
    if(checkUserPresent){
        return res.status(401).send({
            success:false,
            msg:"User already registered"
        })
    }
    // generate otp-
    // otpGenerator.generate se otp generate ho jata hai and length specify kardo otp ka-
    var otp=otpGenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,
    });
    console.log("otp generated",otp);

    // make-sure otp jo aaya hai wo unique hona chahiye-
    // ye brute force tarika hai unique otp generate karne ka-
    let result=await OTP.findOne({otp:otp})
   
    while(result){
        otp=otpGenerator(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        })
        result=await OTP.findOne({otp:otp})
    }
    // ye otp ko databse me enter karna hai-
    const otpPayload={email,otp};

    // create an entry in db-
    const otpBody=await OTP.creat(otpPayload)
    console.log(otpBody)

    res.status(200).send({
        success:true,
        msg:"Otp sent successfully"
    })

} 
    catch (err) {
        console.log("error in generation otp",err)
        return res.status(500).send({
            success:false,
            msg:'error in generating otp'
        })
    }
   
}
// --------signup---------

exports.signUp=async(req,res)=>{

   try {
     // data fetch from req body
     const {firstName,lastName,email,password,confirmPassword,accountType,phn,otp}=req.body
     // validation karo inputs ki
         if(!firstName || !lastName ||!email || !password || !confirmPassword  || !phn || !otp){
             return res.status(403).send({
                 success:false,
                 msg:"All fields are required"
             })
         }
     // 2 password match karo password and confirm password ko-
         if(password!==confirmPassword){
             return res.status(403).send({
                 success:false,
                 msg:"Password and confirm password does not match plase try again"
             })
         }
     // check user already exist -
     const existingUser=await user.findOne({email});
     if(existingUser){

         return res.status(403).send({
             success:false,
             msg:"user already exist , please signin"
         })
     }
        // find most recent otp for the user from the db-
    const recentOtp=await OTP.find({email}).sort({createdAt:-1}).limit(1);
     console.log("recent otp is: ",recentOtp)
     // validate the otp from input of user and db otp
     if(recentOtp.length==0){
         // otp not found-
         return res.status(403).send({
             success:false,
             msg:"Otp not found"
         })
     }
     else if(otp!=recentOtp){
         return res.status(400).json({
             success:false,
             msg:"Otp does not match"
         })
     }
     // hash the password
     const hashedPassword=await bcrypt.hash(password,10);
     // entry create karo db ke andar
     const ProfileDetails=await Profile.create({
         gender:null,
         dateOfBirth:null,
         about:null,
         contactNumber:null
     })
     const user=await User.create({
         firstName,
         lastName,
         email,
         phone,
         password:hashedPassword,
         accountType,
         additionalDetails:ProfileDetails._id,
         image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`
     })
 
     // return result-
     return res.status(200).send({
         success:true,
         msg:"User is registered successfully",
         user
     })
 }
    catch (error) {
    console.log(error)
    return res.status(500).send({
        success:false,
        msg:"User cannot be regestered"
    })
   }
}

// signIn
exports.signIn=async(req,res)=>{
    try {
        // user input lelo-
        const {email,password}=req.body
        if(!email || !password){
            return res.status(403).send({
                success:false,
                msg:"all fields are required"
            })
        }
        // check user exist or not-
        const user=await user.findOne({email})
        if(!user){
            return res.status(403).send({
                success:false,
                msg:"User does not exist kindly , SignUp"
            })

        }

        // password match karo db me se-
        if(await bcrypt.compare(password,user.password)){
            const payload={
                email:user.email,
                id:user._id,
                accountType:user.accountType,
            }
            // jwt token generate-
            const token=jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"2h",
            });

            // 
            user.token=token
            user.password=undefined

              // create cookie- // response send kardo-
        const options={
            expires:new Date(Date.now()+3*24*60*60*1000)
        }
        res.cookie("token",token,options).status(200).send({
            success:true,
            token,
            user,
            msg:"Logged in successfully"

        })
       
    } 
    else{
        return res.status(401).send({
            success:false,
            msg:"password does not match"
        })
    }
}

    catch (err) {
        res.status(500).send({
            success:false,
            msg:"login failed , please try again"
        })
    }
}
// changePassword
exports.changePassword=async(req,res)=>{
    try {
        // get data from req body-old password,newpassword,confirmNewPassword
        const {oldPassword,newPassword,confirmPassword}=req.body

        // koi field khali to nahi-
        if(!oldPassword || !newPassword || !confirmPassword){
            return res.status(403).json({
                success:false,
                msg:'All fields are required'
            })
        }

        // newpassword,confirmpassword match kar raha ki nahi-
            if(newPassword!==confirmPassword){
                return res.status(403).json({
                    success: false,
                    msg: 'New password and confirm password do not match',
                  });
            }

             // validation-password match kar raha ki nahi-
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(403).json({
              success: false,
              msg: 'Old password is incorrect',
            });
          }

        //   hash the new password-
        const hashedPassword=await bcrypt.compare(newPassword,10);
        // update password in db-
         // Get the user from the database (assumes a user is authenticated)
         const userId = req.user.id; // Assuming you have user ID in the request (from JWT)
         const user = await User.findById(userId);
         user.password = hashedPassword;
         await user.save();

        // send mail of password update-

        // return response-
        return res.status(200).json({
            success: true,
            msg: 'Password updated successfully',
          });


    } 
    catch (err) {
        console.log(err)
        return res.status(500).send({
            success:false,
            msg:"Error in changing the password"
        });
    }
}
