const mongoose = require('mongoose');

const deliveryDetailSchema = new mongoose.Schema({
    address: { type: String, required: true },
    pincode: { type: String, required: true },
    mobile: { type: String, required: true },
    city: { type: String },
    state: { type: String },
    landmark: { type: String },
    isDefault: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    deliveryDetails: [deliveryDetailSchema],
    isAdmin: { type: Boolean, default: false },
    availFirstDiscount:{type:Boolean,default:true}
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
