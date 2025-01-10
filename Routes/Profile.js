const express = require("express");
const Router = express.Router();
const {updateProfile,deleteAccount,getAllUserDetails}=require("../controllers/profile")
const{resetPasswordToken,resetPassword}=require("../controllers/ResetPassword")
const {auth}=require("../middleware/auth")



// Routes for profile-
Router.post("/updateProfile",auth,updateProfile)
Router.post("/deleteAccount",auth,deleteAccount);
Router.post("/getUserDetails",auth,getAllUserDetails);

// reset Password routes-
Router.post("/reset-password-token",resetPasswordToken)
Router.post("/resetPassword",resetPassword)
module.exports=Router