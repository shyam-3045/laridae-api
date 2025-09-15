const { getcart } = require("../services/cart")
const { sendSuccess, sendError } = require("../utils/ApiResponse")

exports.cart=async(req,res)=>
{
    try {
        const cart=await getcart(req.user.id)
    if(!cart)
    {
        return sendSuccess(res,"Cart items is empty",cart,200)
    }
    return sendSuccess(res,"Cart items",cart.cartItems,200)
    } catch (error) {
        return sendError(res,"Internal Server Error",500,{error:error.message})
        
    }

}

exports.addToCart=async(req,res)=>
{
    try {
        const cart=await getcart(req.user.id)
        
    } catch (error) {
        
    }
}