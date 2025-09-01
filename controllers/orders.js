const { getMyOrder, createOredr } = require("../services/orders")
const { sendSuccess, sendError } = require("../utils/ApiResponse")
const User=require("../models/User")

exports.getMyOrders=async(req,res)=>
{
    try {
        const {email}=req.body
        const det = await User.findOne({ email: email });
    if (!det) {
      return sendError(res, "User not found", 404);
    }

    const user_id = det._id.toString();
    const order=await getMyOrder(user_id)
    if(!order)
    {
        return sendSuccess(res,"No Orders Placed yet",order,201)
    }
    return sendSuccess(res,"Orders",order,200)
    } catch (error) {
        console.error(error)
        return sendError(res,"Internal server error",500,{error:error.message})
        
    }

}


exports.createOrder =async(req,res)=>
{
     try {
    const { email, products, deliveryDetails, totalAmount, paymentDetails } = req.body;

    if (!email || !products || !deliveryDetails || !totalAmount || !paymentDetails) {
      return sendError(res, "Required Credentials Missing", 400);
    }

    const det = await User.findOne({ email: email });
    if (!det) {
      return sendError(res, "User not found", 404);
    }

    const user_id = det._id.toString();

    const ord={
        user: user_id,
      products,             
      deliveryDetails,      
      totalAmount,
      paymentDetails,      
      paymentInfo:"COD",
      orderStatus:"processing", 
      paymentStatus:"Done", 
      createdAt: new Date(),
    }
    const order = await createOredr(ord)
    

    return sendSuccess(res,"Order created Sucessfullt",order,201)

  } catch (error) {
    console.error(error)
    return sendError(res, "Server error while creating order", 500);
  }
    

}