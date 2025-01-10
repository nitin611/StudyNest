const express = require("express");
const Router = express.Router();
const {updateProfile,deleteAccount,getAllUserDetails}=require("../controllers/profile")



// Routes for profile-
Router.post("/updateProfile",updateProfile)
Router.post("/deleteAccount",deleteAccount);
Router.post("/getUserDetails",getAllUserDetails);
module.exports=Router