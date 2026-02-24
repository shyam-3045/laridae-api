const cloudinary = require("../config/Cloudinary");

const uploadToCloudinary = async (filePath) => {
  try {

    const result = await cloudinary.uploader.upload(filePath, {
      folder: "laridae-products",
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };

  } catch (error) {
    throw new Error("Cloudinary upload failed: " + error.message);
  }
};


const deleteFromCloudinary = async (public_id) => {
  try {

    const result = await cloudinary.uploader.destroy(public_id);

    return result;

  } catch (error) {
    throw new Error("Cloudinary delete failed: " + error.message);
  }
};


module.exports = {
  cloudinary,
  uploadToCloudinary,
  deleteFromCloudinary,
};