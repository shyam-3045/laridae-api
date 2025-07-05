const cloudinary = require("../config/Cloudinary");

exports.uploadToCloudinary = async (filePath) => {
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
