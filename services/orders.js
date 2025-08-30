const Order=require("../models/Orders")

exports.getMyOrder=async(id)=>
{
    const order=await Order.findOne({user:id}).populate("products.product").sort({ createdAt: -1 })
    return order
}

exports.createOredr=async(ord)=>
    
{
    const order = await Order.create(ord)
    return order
    
}