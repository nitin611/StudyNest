const express = require("express");
const Router = express.Router();
const {updateProfile,deleteAccount,getAllUserDetails}=require("../controllers/profile")
const{resetPasswordToken,resetPassword}=require("../controllers/ResetPassword")
const {auth,isStudent}=require("../middleware/auth")



// Routes for profile-
Router.post("/updateProfile",auth,updateProfile)
Router.post("/deleteAccount",auth,isStudent,deleteAccount);
Router.post("/getUserDetails",auth,getAllUserDetails);

// reset Password routes-
Router.post("/reset-password-token",auth,resetPasswordToken)
Router.post("/resetPassword",auth,resetPassword)
module.exports=Router