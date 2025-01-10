const express = require("express");
const Router = express.Router();
const {capturePayment,verifySignature}=require("../controllers/Payment")


// Routes for payments-
Router.post("/paymentCapture",capturePayment)
Router.post("/verifySignature",verifySignature)
module.exports=Router