const Product = require("../models/product");
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
      subcategory,
      isAvailable,
      MOQ,
      MAX,
      shopFlag,
    } = req.body;

    let variants;
    try {
      variants = JSON.parse(req.body.variants);
    } catch (err) {
      return sendError(res, "Invalid variant format", 400, {
        error: err.message,
      });
    }

    if (!name || !Overview) {
      return sendError(res, "Missing required fields 1", 400);
    }
    if (!description || !category) {
      return sendError(res, "Missing required fields 2", 400);
    }
    if (!variants || !subcategory) {
      return sendError(res, "Missing required fields 3", 400);
    }
    if (!MAX || !MOQ || !shopFlag || !isAvailable) {
      return sendError(res, "Missing required fields 4", 400);
    }

    if (!req.files || !req.files.image) {
      return sendError(res, "Image is required", 400);
    }

    const file = req.files.image;

    const uploadedImage = await uploadToCloudinary(file.tempFilePath);
    const url = uploadedImage.url;
    const product = await Product.create({
      name,
      Overview,
      description,
      category,
      subcategory,
      packaging,
      shellLife,
      variants,
      shopFlag,
      isAvailable,
      numOfReviews,
      ratings,
      MAX,
      MOQ,
      images: [
        {
          public_id: uploadedImage.public_id,
          url,
        },
      ],
    });
    console.log(req.body);
    console.log("product created !");
    return sendSuccess(res, "Product Added succesfully", product, 201);
  } catch (error) {
    return sendError(res, "Internal server error", 500, {
      error: error.message,
    });
  }
};

exports.addproductImage = async (req, res) => {
  try {
    const { product_id } = req.body;
    if (!product_id || !req.files || !req.files.image) {
      return sendSuccess(res, "required Details missing", 400);
    }
    const product = await Product.findById(product_id);
    const file = req.files.image;
    const uploadedImage = await uploadToCloudinary(file.tempFilePath);
    const url = uploadedImage.url;

    const newImage = {
      public_id: uploadedImage.public_id,
      url,
    };
    product.images.push(newImage);
    await product.save();
    return sendSuccess(res, "Image added !", newImage, 200);
  } catch (error) {
    return sendError(res, "Internal server Error", 500, error.message);
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await getAllProducts();
    if (!products) {
      return sendSuccess(res, "No products Available", products, 200);
    }
    return sendSuccess(res, "products", products, 200);
  } catch (error) {
    return sendError(res, "Internal Server Error", 500, {
      error: error.message,
    });
  }
};
