const Cart=require("../models/Cart")

exports.getcart=async(id)=>
{
    const cart=await  Cart.findOne({user:id}).populate("cartItems.product")
    return cart
}

exports.createCart=async()=>
{
    
}