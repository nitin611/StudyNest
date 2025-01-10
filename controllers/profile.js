const Profile=require('../Models/profile')
const User=require('../Models/user')

exports.updateProfile=async(req,res)=>{
    try {
        // fetch details-
        const {gender,dateOfBirth="",about="",contactNumber=""}=req.body
        //get  user_id agar user logged in hai to user id req ke andar present hai waha se lelo-
        const id=req.user.id
        // validation of data-
        if(!gender || !contactNumber || !id){
            return res.status(401).send({
                success:false,
                msg:'All fields are required'
            })
        }
        // profile ko find karo 
        const userDetails=await User.findById(id);
        const profileId=userDetails.additionalDetails
        const profileDetails=await Profile.findById(profileId);

        // updation karo-
        profileDetails.dateOfBirth=dateOfBirth;
        profileDetails.contactNumber=contactNumber;
        profileDetails.about=about;
        profileDetails.gender=gender;
        await profileDetails.save();
        

        // return response-
        return res.status(200).send({
            success:true,
            msg:'profile Updated Successfully',
            profileDetails
        })

    } catch (err) {
        console.log(err)
        return res.status(500).send({
            success:false,
            msg:'Error in updating profile'
        })
        
    }
}

exports.deleteAccount=async(req,res)=>{
    try {
        // id fetch karo-
        const id=req.user.id
        // validation karo ki id aaye-
        const userDetails=await User.findById(id)
        if(!userDetails){
            return res.status(404).json({
                success:false,
                msg:'User not found'
            })
        }
        // delete karo sare profile ko then user ko-
        const profileId=userDetails.additionalDetails
        await Profile.findByIdAndDelete(profileId)
        // unenroll user from all enrolled courses then delte the user-
        await User.findByIdAndDelete(id)

        // how can we schedule the task of deletion this account 
        // what is cron job ?? search this
        return res.status(200).send({
            success:true,
            msg:'User deleted successfully'
        });
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success:false,
            msg:'Error in user deletion'
        })
    }
}

// get all userDetails-
exports.getAllUserDetails=async(req,res)=>{
    try {
        const id=req.user.id
        if(!id){
            return res.json({
                success:false,
                msg:"Id is required"
            })
        }
        const userDetails=await User.findById(id).populate("additionalDetails").exec()
        if(!userDetails){
            return res.status(401).send({
                success:false,
                msg:"User not found"
            })
        }
        return res.status(200).send({
            success:true,
            msg:"UserData fetched successfully",
            userDetails
        })
    } catch (err) {
        console.log(err)
        return res.status(500).send({
            success:false,
            msg:"Error in getting all userDetails"
        })
    }
}