const Product = require("../models/product");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../services/cloudinaryUpload");
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
      numOfReviews,
      ratings,
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
    if (MAX == null || MOQ == null || shopFlag == null || isAvailable == null) {
      return sendError(res, "Missing required fields 4", 400);
    }

    if (!req.files || !req.files.image) {
      return sendError(res, "Image is required", 400);
    }

    if (!numOfReviews || !ratings) {
      return sendError(res, "Missing ratings and reviews", 400);
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
    return sendSuccess(res, "Product Added succesfully", product, 201);
  } catch (error) {
    return sendError(res, "Internal server error", 500, {
      error: error.message,
    });
  }
};

exports.addproductImage = async (req, res) => {
  try {
    const { productI } = req.body;
    if (!productI || !req.files || !req.files.image) {
      return sendSuccess(res, "required Details missing", 400);
    }
    const product = await Product.findById(productI);
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

exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return sendError(res, "Product id is required", 400);
    }
    const product = await Product.findByIdAndDelete(productId);
    return sendSuccess(res, "Product deleted successfully", product, 200);
  } catch (error) {
    return sendError(res, "Internal Server Error", 500, {
      error: error.message,
    });
  }
};

exports.editProducts = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return sendError(res, "Product ID is required", 400);
    }

    const product = await Product.findById(id);

    if (!product) {
      return sendError(res, "Product not found", 404);
    }

    const {
      name,
      Overview,
      description,
      category,
      subcategory,
      packaging,
      shellLife,
      isAvailable,
      MOQ,
      MAX,
      shopFlag,
      ratings,
      numOfReviews,
    } = req.body;

    let variants = [];

    if (req.body.variants) {
      try {
        const parsed = JSON.parse(req.body.variants);

        variants = Array.isArray(parsed) ? parsed : [parsed];
      } catch (err) {
        return sendError(res, "Invalid variants JSON format", 400);
      }
    }

    Object.keys(req.body).forEach((key) => {
      const match = key.match(/^variants\[(\d+)\]\[(.+)\]$/);

      if (match) {
        const index = match[1];
        const field = match[2];

        if (!variants[index]) variants[index] = {};

        variants[index][field] = req.body[key];
      }
    });

    if (variants.length > 0) {
      product.variants = variants.map((v) => ({
        weight: v.weight,

        stock: Number(v.stock),

        price: Number(v.price),

        discountedPrice: Number(v.discountedPrice),

        _id: v._id,
      }));
    }

    if (req.files && req.files.image) {
      // delete old image
      if (product.images && product.images.length > 0) {
        await deleteFromCloudinary(product.images[0].public_id);
      }

      const file = req.files.image;

      const uploadedImage = await uploadToCloudinary(file.tempFilePath);

      product.images = [
        {
          public_id: uploadedImage.public_id,
          url: uploadedImage.url,
        },
      ];
    }

    if (name != null) product.name = name;

    if (Overview != null) product.Overview = Overview;

    if (description != null) product.description = description;

    if (category != null) product.category = category;

    if (subcategory != null) product.subcategory = subcategory;

    if (packaging != null) product.packaging = packaging;

    if (shellLife != null) product.shellLife = shellLife;

    if (isAvailable != null) product.isAvailable = isAvailable === "true";

    if (MOQ != null) product.MOQ = Number(MOQ);

    if (MAX != null) product.MAX = Number(MAX);

    if (shopFlag != null) product.shopFlag = Number(shopFlag);

    if (ratings != null) product.ratings = Number(ratings);

    if (numOfReviews != null) product.numOfReviews = Number(numOfReviews);

    await product.save();

    return sendSuccess(res, "Product updated successfully", product, 200);
  } catch (error) {
    return sendError(res, "Internal Server Error", 500, {
      error: error.message,
    });
  }
};
