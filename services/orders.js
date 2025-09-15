const Order=require("../models/Orders")

exports.getMyOrder=async(id)=>
{
const orders = await Order.find({ user: id })
  .populate("products.product_id")
  .sort({ createdAt: -1 });
    return orders
}

exports.createOredr=async(ord)=>
    
{
    const order = await Order.create(ord)
    return order
    
}