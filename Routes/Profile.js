const {Router}=require("express")
const {updateProfile,deleteAccount,getAllUserDetails}=require("../controllers/profile")



// Routes for profile-
Router.post("/updateProfile",updateProfile)
Router.post("/deleteAccount",deleteAccount);
Router.post("/getUserDetails",getAllUserDetails);