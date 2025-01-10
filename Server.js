const express=require('express')
const app=express();
const userRoutes=require("./Routes/User")
const profileRoutes=require("./Routes/Profile")
const paymentRoutes=require("./Routes/payments")
const courseRoutes=require("./Routes/course")
const database=require("./config/databse")
const cookieParser=require("cookie-parser")
const cors=require("cors")
const {cloudinaryConnect}=require("./config/cloudinary");
const fileUpload=require("express-fileupload")
// Load environment variables
require('dotenv').config();

const PORT=process.env.PORT || 4000;

// database connection-
database.connect()

// middleWares-
app.use(express.json())
app.use(cookieParser())
// ------------------cors for frontend connection-------------------
app.use(
    cors({
        origin:"http://localhost:3000",
        credentials:true
    })
)
// File upload middleware
app.use(
    fileUpload({
      useTempFiles: true,
      tempFileDir: '/tmp',
    })
  );

// cloudinary connect-
cloudinaryConnect()

// ------------------------------ROUTES---------------------
app.use("/api/v1/auth",userRoutes)
app.use("/api/v1/profile",profileRoutes)
app.use("/api/v1/course",courseRoutes)
app.use("/api/v1/payment",paymentRoutes)

// default route-
app.get("/",(req,res)=>{
    return res.json({
        success:true,
        msg:"Your server is up"
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on Port: ${PORT}`);
});
