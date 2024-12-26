const cloudinary = require('cloudinary').v2;

exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
    const options = { folder };

    // Add height to options if provided
    if (height) {
        options.height = height;
    }

    // Add quality to options if provided
    if (quality) {
        options.quality = quality;
    }

    // Set resource type to auto
    options.resource_type = "auto";

    try {
        // Upload the file to Cloudinary
        return await cloudinary.uploader.upload(file.tempFilePath, options);
    } catch (error) {
        // Handle the error
        console.error("Error uploading image to Cloudinary:", error);
        throw error;
    }
};
