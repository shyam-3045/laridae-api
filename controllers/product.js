const Product=require("../models/product")
const { uploadToCloudinary } = require("../services/cloudinaryUpload");
const { getAllProducts } = require("../services/product");
const { sendError, sendSuccess } = require("../utils/ApiResponse");

exports.addProduct = async (req, res) => {
  try {
    const {
      name,
      Overview,
      description,
      category,
      packaging,
      shellLife,
      subcategory
    } = req.body;

    let variants;
    try {
      variants = JSON.parse(req.body.variants);
    } catch (err) {
      return sendError(res,"Invalid variant format",400,{error:err.message})
    }

    if (!name || !Overview || !description || !category || !variants ||!subcategory) {
      return  sendError(res,"Missing required fields",400)
    }

    if (!req.files || !req.files.image) {
     return sendError(res,"Image is required",400)
    }

    const file = req.files.image;

    const uploadedImage = await uploadToCloudinary(file.tempFilePath);
    const url=uploadedImage.url
    const product = await Product.create({
      name,
      Overview,
      description,
      category,
      subcategory,
      packaging,
      shellLife,
      variants,
      images: [
        {
          public_id:uploadedImage.public_id,
          url,
        },
      ],
    });
    console.log("product created !")
    return sendSuccess(res,"Product Added succesfully",product,201)
  } catch (error) {
    return sendError(res,"Internal server error",500,{error:error.message})
  }
};


exports.getAllProducts=async(req,res)=>
{
  try {
    
    const products=await getAllProducts()
  if(!products){
    return sendSuccess(res,"No products Available",products,200)
  }
  return sendSuccess(res,"products",products,200)
  } catch (error) {
    return sendError(res,"Internal Server Error",500,{error:error.message})
  }
  
}