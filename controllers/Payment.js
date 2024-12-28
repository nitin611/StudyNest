const user=require('../Models/user')
const {instance}=require('../config/razorpay')
const Course=require('../Models/Course')
const mailSender=require('../utils/mailSender')
const { default: mongoose } = require('mongoose')

// capture the payment and initiate the Razorpay order-
exports.capturePayment=async(req,res)=>{
   
        //------- fetch data -------
        const {courseId}=req.body
        const userId=req.user.id
        // validation 
        if(!courseId){
            return res.json({
                success:false,
                msg:'Please provide valid course id'
            })
        }


        // valid courseDetails-
        let course;
        try {
            course=await Course.findById(courseId)
            if(!course){
                return json({
                    success:false,
                    msg:'Could not found the course'
                })
            }
             // user already paid to this course ? if yes then return-
            //  model me user  object id ke tarah present hai and yahan pe user id jo hai wo
            //  string format me hai so convert the userID into objectId -
            const uid=new mongoose.Types.ObjectId(userId);
            // check karo course ke andar ye uid pehle se to nahi hai agar hai to ye user ish course ko
            // buy kar chuka hai-
            if(course.studentsEnrolled.includes(uid)){
                return res.status(200).send({
                    success:false,
                    msg:'Course Already present'
                });
            }

        } catch (error) {
            console.error(error)
            return res.status(500).send({
                success:false,
                msg:error.message
            })
        }

       
        // order create karo-
        const amount=course.price
        const currency="INR"
        const options={
            amount:amount*100,
            currency,
            receipt:Math.random(Date.now()).toString(),
            notes:{
                courseId:courseId,
                userId
            }
        }
        // order create karo-
        try {
            const paymentResponse=await instance.orders.create(options)
            console.log(paymentResponse)
            // return response-
            return res.status(200).send({
                success:true,
                courseName:course.courseName,
                courseDescription:course.courseDescription,
                thumbnail:course.thumbnail,
                orderId:paymentResponse.id,
                currency:paymentResponse.currency,
                amount:paymentResponse.amount,
                msg:'Payment Successful'
            })

        } catch (error) {
            console.log(error)
            return res.status(500).send({
                success:false,
                msg:'could not initiate payment order'
            })
        }
}

// verify the signature of razorpay and server-
// matching of secret of server and razorpay
exports.verifySignature=async(req,res)=>{
    // ye signature server pe para hua hai
    const webhookSecret="12345678";

    // ye razorpay se secret key mila hai-
    const signature=req.headers["x-razorpay-signature"];
    // 1.) ye jo signature mila hai ye hashed hai so server wale se match karne ke liye isko decrypt 
    // kar nahi sakte kyuki hashed wali cheze decrypt ni ho sakti so->
    // 2.) jo webhookSecret server pe hai usko hash karo
    // 3.)match karo dono same aajaye to authorize ho jayega agar same nahi aaya to galat hai

    // A)create hmac object-
    const shasum=crypto.createHmac("sha256",webhookSecret);
    // b.)ish hmac object ko string format me convert karo-
    shasum.update(JSON.stringify(req.body));

    // jab haam hashing algo ko kisi text ke upar run karte hai usse jo output aata hai usko bolte hai
    // digest-
    const digest=shasum.digest("hex")

    // NOW MATCH THIS DIGEST AND signature to aage badho if match it means payment is AUTHORIZED-
    if(signature===digest){
        console.log('Payment is Authorized')
        // notes me courseId and userId update kiye the wahi se fetch kiye hai taki course ko student ke
        // andar dikha sake after successful purchase-
        const {courseId,userId}=req.body.payload.payment.entity.notes;
        // logic for 
        try {
            // fulfill the action-student ko enroll karo
            // find the course and enroll the student in the course after successful transaction-
            const enrolledCourse=await Course.findOneAndUpdate({_id:courseId},
                                                        {$push:{studentsEnrolled:userId}},
                                                    {new:true});
                if(!enrolledCourse){
                    return res.status(500).send({
                        success:false,
                        msg:'Course not found'
                    })
                }
                console.log(enrolledCourse)

                // find the student  and add the course in the list of enrolled courses-
                const enrolledStudent=await user.findOneAndUpdate(
                                                    {_id:userId},
                                                    {$push:{
                                                        courses:courseId}},
                                                        {new:true}
                );
                console.log(enrolledStudent)

                // send mail to the student about confirmation mail-
                const emailResponse=await mailSender(
                                        enrolledStudent.email,
                                        "Congratulations",
                                        " You are Enrolled in the StudyNest Course",
                                        
                );
                // return response-
                console.log(emailResponse)
                return res.status(200).send({
                    success:true,
                    msg:'Signature verified and course added in student dashboard'

                })

        } catch (error) {
            console.log(error)
            return res.status(500).send({
                success:false,
                msg:error.message
            })
        }

    }
    else{
        // signature match nahi hua to-
        return res.status(500).send({
            success:false,
            msg:'Invalid signature does not match with digest'
        })
    }



    
}


