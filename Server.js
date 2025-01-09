const express=require('express')
const app=express();
require("dotenv").config
const userRoutes=require("./Routes/User")
const profileRoutes=require("./Routes/Profile")
const paymentRoutes=require("./Routes/payments")
const courseRoutes=require("./routes/Course")

const database=require("./config/database")
const cokkieParser=require("cookie-parser")
const cors=require("cors")
const {cloudinaryConnect}=require("./config/cloudinary");



app.listen()