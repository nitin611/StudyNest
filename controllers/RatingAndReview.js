const RatingAndRevies=require("../Models/RatingAndRevie")
const course=require("../Models/Course")
const RatingAndRevie = require("../Models/RatingAndRevie")
const Course = require("../Models/Course")

// ----------------------------------createRating--------------------------------------------
exports.createRating=async(req,res)=>{
    try {
        // data fetch karo userId,courseId,Star,review ka string from req-
        const userId=req.user.id
        const {rating,review,courseId}=req.body
        // fetch data from userKi body-

        // check if user is enrolled or not-
        const courseDetails=await Course.findOne({_id:courseId,
                                                studentsEnrolled:{$eleMatch:{$eq:userId}},
        });
        if(!courseDetails){
            return res.status(403).send({
                success:false,
                msg:'Student is not enrolled in the course'
            });
        }
        // check if the student have already reviewed or not-
        const alreadyReviewd=await RatingAndRevies.findOne({
                                                    user:userId,
                                                    course:courseId,
        });
        if(alreadyReviewd){
            return res.status(403).send({
                success:false,
                msg:'User has already reviewd the course'

            });

        }
        // create kardo Rating review.
        const RatingAndRevie=await RatingAndRevie.create({
                                                rating,review,
                                                courseId:courseId,
                                                userId:userId
        });
        // Attach karo ish rating review ko course ke model me jisbhi course ko ye rating review diye hai 
        await Course.findByIdAndUpdate({_id:courseid},
                                        {
                                            $push:{
                                                RatingAndReviews:RatingAndRevie._id,
                                            }
                                        },{new:true}
        )
        // return kardo response ko-
        return res.status(200).send({
            success:true,
            msg:"Rating and review updated successfully",
            RatingAndRevie
        })


    }
     catch (err) {
        console.log(err)
        return res.status(500).send({
            success:false,
            msg:'Error in creating Rating'
        })
        
        
    }
}
   

// getAverageRating-
    exports.getAvgRating=async(req,res)=>{
        try {
            // fetch courseId-
            const courseId=req.body.courseid;
            // calculating avg rating-
            const result=await RatingAndRevie.aggregate([
                {
                    $match:{
                        course:new mongoose.Types.objectId(courseId),
                    },

                },
                {
                    $group:{
                        _id:null,
                        averageRating:{$avg:"rating"}
                    }
                }
            ])


            // return response response ek array hai isliye length check karlo-
            if(result.length>0){
                return res.status(200).send({
                    success:true,
                    avgRating:result[0].averageRating,
                })
            }
            // if no review or rating exist then-
            return res.status(200).send({
                success:true,
                msg:"Avg rating 0 no rating given",
                avgRating:0
            });
            
        } catch (err) {
            console.log(err)
            return res.status(500).send({
                success:false,
                msg:"Error in getting avg ratting"
            })
        }
    }

    // 
// getAllrating- User jo rating and review dete hai wo display karwane ke liye hai-
exports.getAllRating=async(req,res)=>{
    try {
        // fetch input from req-
        const allReviews=RatingAndRevie.find({}).sort({rating:"desc"}).populate({
                                                                        path:"user",
                                                                        select:"firstName lastName email image"
        }).populate({
            path:"course",
            select:"courseName"
        }).exec();
        // yahan pe hamne bataya hai user ke andar kis kis chiz ko populate karwana hai wo sab hai 
        // select ke andar-

        return res.status(200).send({
            success:true,
            msg:'All review fetched successfully',
            data:allReviews
        })

    } catch (err) {
        console.log(err)
        return res.status(500).send({
            success:false,
            msg:"Error in getting all rating"
        })
        
    }
}

