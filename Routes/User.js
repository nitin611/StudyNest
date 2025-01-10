const { Router } = require("express")
const {signIn,signUp,sendOTP,changePassword}=require("../controllers/Auth")
const {resetPassword,resetPasswordToken}=require("../controllers/ResetPassword")

const {auth}=require("../middleware/auth")

// ROUTES for login signup and authentication-

// Route for login-
Router.post("/login",signIn)
Router.post("/signUp",signUp)
Router.post("/changePassowrd",changePassword)
Router.post("/sendOtp",sendOTP)

