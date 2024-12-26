const cloudinary=require('cloudinary').v2


exports.uploadImageToCloudinary=async(file,folder,height,quality){
    const options={folder}
    // height aur quality se compress kar sakte hai heght ko change kar ke bhi compress kar sakte hai-
    // quality se bhi compress kar sakte hai-
    if(height){
        options.height=height
    }
    if(quality){
        options.quality=quality
    }
    options.resource_type="auto"
    return await cloudinary.uploader.upload(file.tempFilePath,options)
}