const cloudinary = require('cloudinary').v2

exports.uploadToCloudinary  = async (file, folder, height, quality) => {
    const options = {folder};
    if(height) {
        options.height = height;
    }
    if(quality) {
        options.quality = quality;
    }
    options.resource_type = "auto";
    
  if (file.mimetype && file.mimetype.startsWith("video")) {
    options.type = "authenticated"; // secure videos
  } else {
    options.type = "upload"; // normal images
  }
    return await cloudinary.uploader.upload(file.tempFilePath, options);
}