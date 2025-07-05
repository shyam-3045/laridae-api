const product=require("../models/product")

exports.getAllProducts=async()=>
{
    const Products=await product.find()
    return Products
}