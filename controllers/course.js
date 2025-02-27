const Course=require('../Models/Course')
const Category=require('../Models/Category')
const User=require('../Models/user')
const {uploadImageToCloudinary}=require('../utils/imageUploader')

// ---------------------------create course handler------------------------------------

exports.createCourse=async(req,res)=>{
    
    try {
        // data fetch karo-
        const {courseName,courseDescription,whatYouWillLearn,price,CategoryId}=req.body
        // file fetch karo-
        const thumbnail=req.files.thumbnailImage;
        // validation karo fetched data ko-
        if(!courseName || !courseDescription ||!whatYouWillLearn || !price || !CategoryId || !thumbnail){
            return res.status(403).json({
                success:false,
                msg:"All fields are required"
            })
        }
        // course ke andar instructor ka object id chahiye isliye yaha db call hui hai
        // yaha instructor ki detail chahiye-
        // validation of instructor wahi create kar sakta course ko-

        const userId=req.user.id;
        const instructorDetails=await User.findById(userId)
        console.log("Instructor Details:",instructorDetails);

        // agar ish id ke liye kuch ni mila to-
        if(!instructorDetails){
            return res.status(404).send({
                success:false,
                msg:'Instructor details not found'
            })  
        }

        // Category ka validation karo - Category jo body me mil raha wo ek id hai kyuki course ke model me chekc karo -
        const CategoryDetails=await Category.findById(CategoryId)
        if(!CategoryDetails){
            return res.status(403).json({
                success:false,
                msg:'No Category found'
            })
        }

        // course ke image ko cloudinary me upload karo-SECURE URL milega
        const thumbnailImage=await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME)
  
        // database me entry create karo course ki-
        const newCourse=await Course.create({
            courseName,
            courseDescription,
            instructor:instructorDetails._id,
            whatYouWillLearn,
            price,
            Category:CategoryDetails._id,
            thumbnail:thumbnailImage.secure_url,
        })

        // add the new course in user schema -ye Instructor jo course banaya hai uske andar add kardo-
       
        await User.findByIdAndUpdate(
            {_id:instructorDetails._id},
            {
                $push:{
                    courses:newCourse._id
                }
            },{new:true})

        // Category Schema jo bana hai uske andar bhi ye course add kardo-
            await Category.findByIdAndUpdate(
                {_id:CategoryDetails._id},
                {
                    $push:{
                        course:newCourse._id
                    }
                },
                {new:true}
            )
        // return response-
        return res.status(200).send({
            success:true,
            msg:"Course created successfully, updated course inside category and Instructor page also",
            data:newCourse
        })
    } 
    catch (error) {
        console.log(error)
        return res.status(500).send({
            success:false,
            msg:"Error in creating new course"
        })

        
    }
}

// -----------------------------------get allcourses ----------------------------------
exports.getAllCourse=async(req,res)=>{

    try {

        const allCourse=await Course.find({}).populate("CourseContent").populate("instructor")
        return res.status(200).json({
            success:true,
            message:'data for all courses fetched successfully',
            data:allCourse
        })
    }
     catch (error) {
        console.log(error)
        return res.status(500).send({
            success:false,
            msg:"Error in getting all course",
            error:error.message
        })
    }
}

// get courseDetails-
exports.getCourseDetails=async(req,res)=>{

    try {
     // data courseId karo-
        const {courseId}=req.body
    // validation karo-
    if(!courseId){
        return res.json({
            success:false,
            msg:'Give course id'
        })
    }

    // get details call karo with populate to fetch all details-
    const courseDetails=await Course.findById(
                                        {_id:courseId})
                                        .populate(
                                            {
                                                path:'instructor',
                                                populate:{
                                                    path:"additionalDetails"
                                                }
                                            }
                                        )
                                        .populate("RatingAndReviews")
                                        .populate("Category")
                                        .populate({
                                            path:"CourseContent",
                                            populate:{
                                                path:"SubSection"
                                            }
                                        }).exec()
    if(!courseDetails){
        res.status(401).send({
            success:false,
            msg:`Could not find the course with courseID: ${courseId}`
        });
    }
    // result send kardo->
    return res.status(200).send({
        success:true,
        msg:'Course details fetched successfully',
        data:courseDetails
    })
    } 
    catch (error) {
        console.log(error)
        return res.status(500).send({
            success:false,
            msg:'Error in fetching courseDetails'
        })
    }
}
