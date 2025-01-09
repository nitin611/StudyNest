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
            });

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
        });
    } 
    catch (err) {
        console.log(err)
        return res.status(500).send({
            success:false,
            msg:"Error in getting all Categorys"
        })
    }
}
// categoryPageDetails-Most Popular course,top course, frequiantly buy course-
// different type of course show karna -

exports.CategoryPageDetails=async(req,res)=>{
    try {
        // get categoryId-
        const {categoryId}=req.body;
        // ush category ke corresponding jitne bhi courses hai unko fetch karlo-
        const selectedCategory=await Category.findById(categoryId)
                                                    .populate("course").exec();
        // validation karlo-
        if(!selectedCategory){
            return res.status(403).send({
                success:false,
                msg:"Cannot find the selected Category course"
            });

        }

        // get courses for different categories-
        // aise category ka data lake do jiska id different ho
        const differentCategories=await Category.find({_id:{$ne:categoryId},
                                                    }).populate("courses").exec();
        // get topSelling courses-
        const topSellingCourses = await Course.find()
        .sort({ studentsEnrolled: -1 })
        .limit(5); // Adjust the limit as per your requirement
            

        // return all the 3 types of result-
            return res.status(200).send({
                success:true,
                data:{
                    selectedCategory,
                    differentCategories,
                },
                msg:"All categories data fetched successfully"
            })

    } catch (err) {
        console.log(err)
        return res.status(500).send({
            success:false,
            msg:"Error in getting categorypage details"
        })
        
    }
}