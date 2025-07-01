const { getMyOrder } = require("../services/orders")
const { sendSuccess, sendError } = require("../utils/ApiResponse")

exports.getMyOrders=async(req,res)=>
{
    try {
        const order=await getMyOrder(req.user.id)
    if(!order)
    {
        return sendSuccess(res,"No Orders Placed yet",order,201)
    }
    return sendSuccess(res,"Orders",order,200)
    } catch (error) {
        return sendError(res,"Internal server error",500,{error:error.message})
        
    }

}