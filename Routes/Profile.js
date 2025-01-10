const express = require("express");
const Router = express.Router();
const {updateProfile,deleteAccount,getAllUserDetails}=require("../controllers/profile")
const {auth}=require("../middleware/auth")


// Routes for profile-
Router.post("/updateProfile",auth,updateProfile)
Router.post("/deleteAccount",deleteAccount);
Router.post("/getUserDetails",auth,getAllUserDetails);
module.exports=Router