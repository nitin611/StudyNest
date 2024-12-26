// admin will create the tags for the platform-
// By that predifiend tag instructors can create courses with those tags-

const Tag=require('../Models/tags')

// create tag-
exports.createTag=async(req,res)=>{
    try {
        const {name,descreption}=req.body

        if(!name || !descreption){
            return res.status(400).send({
                success:false,
                msg:'All fields are required'
            })

        }
        // create entry in db-
        const tagDetails=await Tag.create({
            name,
            descreption
        })
        console.log(tagDetails)
        // return response-
        return res.status(200).send({
            success:true,
            msg:'Tag created successfully'
        })
    } catch (err) {
        console.log(err)
        return res.status(500).send({
            success:false,
            msg:"Error in tag creation"
        })
        
    }
}

// get all tags-
exports.getAllTags=async(req,res)=>{
    try {
        // har tag ke entry me name hona chaiye and description bhi present hona chaiye-

        const allTags=await Tag.find({},{name:true,descreption:true});
        return res.status(200).send({
            success:true,
            msg:"All tags fetched successfully"
        })
    } 
    catch (err) {
        console.log(err)
        return res.status(500).send({
            success:false,
            msg:"Error in getting all tags"
        })
        
    }
}

// 