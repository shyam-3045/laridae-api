const { sendError, sendSuccess } = require("../utils/ApiResponse");
const User = require("../models/User");

const isAddressDuplicate = (userData) => {
  const normalize = (str) =>
    str?.toLowerCase().trim().replace(/\s+/g, " ") || "";

  return userData.deliveryDetails.some((savedAddress) => {
    return (
      normalize(savedAddress.address) === normalize(userData.address) &&
      normalize(savedAddress.pincode) === normalize(userData.pincode) &&
      normalize(savedAddress.mobile) === normalize(userData.mobile) &&
      normalize(savedAddress.city) === normalize(userData.city) &&
      normalize(savedAddress.state) === normalize(userData.state) &&
      normalize(savedAddress.landmark) === normalize(userData.landmark)
    );
  });
};

exports.addUserDetails = async (req, res) => {
  try {
    const { userData, userDet } = req.body;
    const userDetails = JSON.parse(userDet);
    const phone = userDetails.state.data.user;

    const user = await User.findOne({ phone: phone });
    if (!user) {
      return sendError(res, "User Not Found", 401);
    }

    if (userData.setAsDefault) {
      const defaultAddIndex = user.deliveryDetails.findIndex(
        (det) => det.isDefault === true,
      );
      if (defaultAddIndex !== -1) {
        user.deliveryDetails[defaultAddIndex].isDefault = false;
      }
    }
    const isDuplicate = isAddressDuplicate({
      ...userData,
      deliveryDetails: user.deliveryDetails,
    });

    if (isDuplicate) {
      return sendSuccess(res, "Address already exists", userData, 200);
    }

    user.deliveryDetails.push({ ...userData });
    await user.save();

    return sendSuccess(res, "Address added successfully!", userData, 200);
  } catch (error) {
    console.log(error.message);
    return sendError(res, "Internal Server Error", 500, {
      error: error.message,
    });
  }
};

exports.editUserDetails = async (req,res) => {
  try {
    const { userData, userDet } = req.body;
    const userDetails = JSON.parse(userDet);
    const phone = userDetails.state.data.user;

    const user = await User.findOne({ phone: phone });
    if (!user) {
      return sendError(res, "User Not Found", 401);
    }
    user.availFirstDiscount = userData.availFirstDiscount
    await user.save();
    return sendSuccess(res, "Address added successfully!", userData, 200);
  } catch (error) {
    console.log(error.message);
    return sendError(res, "Internal Server Error", 500, {
      error: error.message,
    });
  }
};

exports.getUserDetails=async(req,res)=>
{
  try {
    const {Userdata,code}=req.body
    const userDetails = JSON.parse(Userdata);
    const phone = userDetails.state.data.user;
    const user = await User.findOne({ phone: phone });
    if (!user) {
      return sendError(res, "User Not Found", 401);
    }
    const data = {
      user,
    };

    if(code == process.env.CODE)
    {
      return sendSuccess(res, "Login successful", data, 200);
    }
    return sendError(res, "unauthorized ", 401);

  } catch (error) {
    console.log(error.message);
    return sendError(res, "Internal Server Error", 500, {
      error: error.message,
    });
  }
}

exports.getAlluserdetails=async()=>
{
  try {
    
  } catch (error) {
    console.log(error.message);
    return sendError(res, "Internal Server Error", 500, {
      error: error.message,
    });
  }
}