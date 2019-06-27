const cloudinary = require('cloudinary');

module.exports = async (fileUrl) => {
    return await cloudinary.v2.uploader.upload(fileUrl);
} 