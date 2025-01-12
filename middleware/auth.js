const jwt=require('jsonwebtoken')
const User = require('../Models/user');
require('dotenv').config

// auth
exports.auth=async(req,res,next)=>{
    try {
        // verify jwt token-
        // extract token from either-body,header,bearer token-
        const token = req.cookies.token || req.body.token || req.header("Authorization")?.replace("Bearer ", "").trim();

        if(!token){
            return res.status(403).send({
                success:false,
                msg:"Token is missing or token is expired kindly signin Again"
            })
        }

        // verify the token-using secret key-
        try {
            const decode= jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode)
            req.user=decode
        } 
        catch (error) {
            console.log(error)
            res.status(401).send({
                success:false,
                msg:"Token is invalid"
            })
        }
        next()
    } 
    catch (err) {
        console.log(err)
        res.status(500).send({
            success:false,
            msg:"something went wrong while validation user"
        })
    }
}
// admin
exports.isAdmin=async(req,res,next)=>{
    try {
        //1st tarika- payload ke samay role daale the to yaha pe uska use kar sakte hai pehle bhi kiye hai
        
            if(req.user.accountType!=='Admin'){
                return res.status(401).send({
                    success:false,
                    msg:"This is a protected route for Admin only"
                })
            }
            next()
    } catch (err) {
        console.log(err)
        res.status(500).send({
            success:false,
            msg:"Error in verifying Admin role"
        })
    }
}
// Instructor
exports.isInstructor=async(req,res,next)=>{
    try {
        //1st tarika- payload ke samay role daale the to yaha pe uska use kar sakte hai pehle bhi kiye hai
            if(req.user.accountType!=='Instructor'){
                return res.status(401).send({
                    success:false,
                    msg:"This is a protected route for Instructor only"
                })
            }
            next()
    } catch (err) {
        console.log(err)
        res.status(500).send({
            success:false,
            msg:"Error in verifying Instructor role"
        })
    }
}
// student
exports.isStudent=async(req,res,next)=>{
    try {
        //1st tarika- payload ke samay role daale the to yaha pe uska use kar sakte hai pehle bhi kiye hai
            if(req.user.accountType!=='Student'){
                return res.status(401).send({
                    success:false,
                    msg:"This is a protected route for student only"
                })
            }
            next()
    } catch (err) {
        console.log(err)
        res.status(500).send({
            success:false,
            msg:"Error in verifying student role"
        })
    }
}