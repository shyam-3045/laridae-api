const { sendSuccess, sendError } = require("../utils/ApiResponse");
const Razorpay=require("razorpay")
const crypto=require("crypto")

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,       
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


exports.createOrder= async (req,res)=>
{
    try {
    const { amount, currency = "INR", receipt } = req.body;

    const options = {
      amount: amount * 100,  
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    
    return sendSuccess(res,"Payment Done Sucessfully",order,201)
  } catch (err) {
    console.error("Order error:", err);
    res.status(500).json({ error: "Order creation failed" });
  }
}

exports.verifyPayement=async (req,res)=>
{
    
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign.toString())
    .digest("hex");

  if (razorpay_signature === expectedSign) {
    const response={
      success:true
    }
    console.log(response)
    return sendSuccess(res,"Verified Success",response,201)
  } else {
    console.log("something went wrong !?")
    return res.status(400).json({ success: false, message: "Invalid signature" });
  }
    
  } catch (error) {
    console.log(error)
    return sendError(res,"Internal Server Error",500)
  }
}

exports.webhook=async(req,res)=>
{
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  if (digest === req.headers["x-razorpay-signature"]) {
    console.log("Webhook verified:", req.body.event);
    return sendSuccess(res,"DONE !",201)
  } else {
    res.status(400).json({ status: "invalid signature" });
  }
}