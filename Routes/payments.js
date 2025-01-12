const express = require("express");
const Router = express.Router();
const {capturePayment,verifySignature}=require("../controllers/Payment")
const {auth,isStudent}=require("../middleware/auth")

// Routes for payments-
Router.post("/paymentCapture",auth,isStudent,capturePayment)
Router.post("/verifySignature",auth,isStudent,verifySignature)
module.exports=Router