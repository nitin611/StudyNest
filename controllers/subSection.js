const SubSection=require('../Models/SubSection')
const Section=require('../Models/section')
const { uploadImageToCloudinary } = require('../utils/imageUploader')


// create subsection-
exports.createSubSection=async(req,res)=>{
    try {
        // data fetch->
        const {title,timeDuration, description,sectionId}=req.body
        const video=req.files.videoFile
        // validation of data->
        if(!title || !timeDuration || !description ||!sectionId){
            return res.status(403).json({
                success:false,
                msg:'All fields are required'
            })
        }
        // upload video on cloudinary->
        
        const videoUploadDetails=await uploadImageToCloudinary(video,process.env.FOLDER_NAME)
        // secure url of video ko fetch karo-
        // subsection create karo->
        const SubSectionDetails=await SubSection.create({title,timeDuration,description,videoUrl:videoUploadDetails.secure_url})
        // section Schema  me id add karo subsection ke objectId ka
        const updatedSection=await Section.findByIdAndUpdate(sectionId,{
            $push:{
                SubSection:SubSectionDetails._id
            }
        },{new:true});
        // log updated section here after adding populate query here in testing

        // response send karo-
        return res.status(200).send({
            success:true,
            msg:"sub-section created successfully",
            SubSectionDetails
        })
    } catch (err) {
        console.log(err)
        return res.status(500).send({
            success:false,
            msg:"Error in subsection creation"
        })
    }
}


// update subsection-
exports.updatedSubSection=async(req,res)=>{
    try {
        // fetch user data-
        const { subSectionId, title, timeDuration, description } = req.body;
        let video = req.files?.videoFile;
        // validate user data-
        if (!subSectionId) {
            return res.status(400).json({
                success: false,
                msg: 'Sub-section ID is required'
            });
        }
         // prepare update object
         const updateData = {};

         if (title) updateData.title = title;
         if (timeDuration) updateData.timeDuration = timeDuration;
         if (description) updateData.description = description;
 
         // upload video if provided
         if (video) {
             const videoUploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
             updateData.videoUrl = videoUploadDetails.secure_url;
         }
          // update data->
        const updatedSubSection = await SubSection.findByIdAndUpdate(subSectionId, updateData, { new: true });

        if (!updatedSubSection) {
            return res.status(404).json({
                success: false,
                msg: 'Sub-section not found'
            });
        }

        // return response-
        return res.status(200).json({
            success: true,
            msg: 'Sub-section updated successfully',
            updatedSubSection
        });
    }
     catch (err) {
        console.log(err)
        return res.status(500).send({
            success:false,
            msg:"Error in updating the Sub-section"
        
        })
    }
}


// delete subsection-
exports.deleteSubSection=async(req,res)=>{
    try {
        const {SubSectionId}=req.params

        if(!SubSectionId){
            return res.status(401).send({
                success:false,
                msg:"Subsection id is required"
            })
        }
        await SubSection.findByIdAndDelete(SubSectionId);
        return res.status(200).send({
            success:true,
            msg:'SubSection deleted Successfully'
        });
    } catch (err) {
        console.log(err)
        return res.status(500).send({
            success:false,
            msg:"Error in deleting the Sub-section"
        
        })
    }
}
