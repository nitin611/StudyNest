const Section=require('../Models/section')
const Course=require('../Models/Course')
const section = require('../Models/section')

exports.createSection=async(req,res)=>{
    try {
        // data fetch-
        const {sectionName,courseId}=req.body
        // validation-
        if(!sectionName || !courseId){
            return res.status(403).json({
                success:false,
                msg:'All fields are required'
            })
        }
        // section create karo-
        const newSection=await Section.create({sectionName});
        // course ko fetch karo and ish section id ko update karo course ke andar-
        const updatedCourse=await Course.findByIdAndUpdate(courseId,
                                                            {
                                                                $push:{
                                                                    CourseContent:newSection._id
                                                                }
                                                            },{new:true})
        // -use populate to replace sections/sub-section both in updatedCourse not just its id
        // fetch whole object of it using populate method during testing

        // return response-
        res.status(200).send({
            success:true,
            msg:'section created Successfully',
            updatedCourse
        })

    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success:false,
            msg:"Error in section creation"
        })
    }
}

// update createSection-
exports.updateSection=async(req,res)=>{
    try {
        // fetch user data-
        const {sectionName,sectionId}=req.body

        // validation on data-
        if(!sectionName || !sectionId){
            return res.status(403).send({
                success:false,
                msg:'All fields are required'
            })
        }
        // update data-
        const section=await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true});

        // return response-
        return res.status(200).send({
            success:true,
            msg:'section updated successfully',
            section
        })
    } catch (err) {
        console.log(err)
        return res.status(500).send({
            success:false,
            msg:"Error in updating the section"
        
        })
    }
}

// delete section
exports.deleteSection=async(req,res)=>{
    try {
        // fetch user data-
        const {sectionId}=req.params

        // validation on data-
        if( !sectionId){
            return res.status(403).send({
                success:false,
                msg:'All fields are required'
            })
        }
        // update data-
        await Section.findByIdAndDelete(sectionId);

        // delete section entry from courseSchema also-

        // return response-
        return res.status(200).send({
            success:true,
            msg:'section deleted successfully',
           
        })
    } catch (err) {
        console.log(err)
        return res.status(500).send({
            success:false,
            msg:"Error in deleting the section"
        
        })
    }
}