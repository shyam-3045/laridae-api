const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [{
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true
  }
}],

  deliveryDetails: {
    address: { type: String, required: true },
    pincode: { type: String },
    mobile: { type: String },
    city: { type: String },
    state: { type: String },
    isDefault: { type: Boolean, default: false },
  },
  totalAmount: Number,
  paymentDetails: {
    razorpay_order_id: String,
    razorpay_payment_id: String,
    razorpay_signature: String, 
  },
  paymentStatus: { type: String, default: "Pending" },
  paymentInfo:{
    type:String,
    enum:["Online","COD"],
    required:true
  },
  orderStatus: { type: String, default: "Processing" },
  createdAt: {
    type: Date,
    default: Date.now
  },
  waitStatus: {
    type: String,
    default: "Wait"
  }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
