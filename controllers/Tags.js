// admin will create the Categorys for the platform-
// By that predifiend Category instructors can create courses with those Categorys-

const Category=require('../Models/Category')

// create Category-
exports.createCategory=async(req,res)=>{
    try {
        const {name,descreption}=req.body

        if(!name || !descreption){
            return res.status(400).send({
                success:false,
                msg:'All fields are required'
            })

        }
        // create entry in db-
        const CategoryDetails=await Category.create({
            name,
            descreption
        })
        console.log(CategoryDetails)
        // return response-
        return res.status(200).send({
            success:true,
            msg:'Category created successfully'
        })
    } catch (err) {
        console.log(err)
        return res.status(500).send({
            success:false,
            msg:"Error in Category creation"
        })
        
    }
}

// get all Categorys-
exports.getAllCategorys=async(req,res)=>{
    try {
        // har Category ke entry me name hona chaiye and description bhi present hona chaiye-

        const allCategorys=await Category.find({},{name:true,descreption:true});
        return res.status(200).send({
            success:true,
            msg:"All Categorys fetched successfully"
        })
    } 
    catch (err) {
        console.log(err)
        return res.status(500).send({
            success:false,
            msg:"Error in getting all Categorys"
        })
        
    }
}

// 