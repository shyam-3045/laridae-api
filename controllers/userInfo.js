const { sendError, sendSuccess } = require("../utils/ApiResponse");
const User = require("../models/User");
const Order = require("../models/Orders");

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
    
    return sendError(res, "Internal Server Error", 500, {
      error: error.message,
    });
  }
};

exports.editUserDetails = async (req, res) => {
  try {
    const { userData, userDet } = req.body;
    const userDetails = JSON.parse(userDet);
    const phone = userDetails.state.data.user;

    const user = await User.findOne({ phone: phone });
    if (!user) {
      return sendError(res, "User Not Found", 401);
    }
    user.availFirstDiscount = userData.availFirstDiscount;
    await user.save();
    return sendSuccess(res, "Address added successfully!", userData, 200);
  } catch (error) {
    
    return sendError(res, "Internal Server Error", 500, {
      error: error.message,
    });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const { Userdata, code } = req.body;
    const userDetails = JSON.parse(Userdata);
    const phone = userDetails.state.data.user;
    const user = await User.findOne({ phone: phone });
    if (!user) {
      return sendError(res, "User Not Found", 401);
    }
    const data = {
      user,
    };

    if (code == process.env.CODE) {
      return sendSuccess(res, "Login successful", data, 200);
    }
    return sendError(res, "unauthorized ", 401);
  } catch (error) {
    
    return sendError(res, "Internal Server Error", 500, {
      error: error.message,
    });
  }
};

exports.getAlluserdetails = async (req, res) => {
  try {
    const users = await User.find().select("-password -isAdmin").lean();

    const formattedUsers = users.map((user) => {
      

      const defaultAddress = user.deliveryDetails.find((d) => d.isDefault);

      return {
        ...user,
        deliveryDetails: defaultAddress
          ? [defaultAddress]
          : user.deliveryDetails.length > 0
            ? [user.deliveryDetails[0]]
            : [],
      };
    });

    return sendSuccess(res, "Details fetched Done !", formattedUsers, 200);
  } catch (error) {
    
    return sendError(res, "Internal Server Error", 500, {
      error: error.message,
    });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ user: userId })
      .select("-paymentDetails")
      .populate({
        path: "user",
        select: "name phone",
      })
      .lean();

    return sendSuccess(res, "User Orders Details fetched Done !", orders, 200);
  } catch (error) {
    
    return sendError(res, "Internal Server Error", 500, {
      error: error.message,
    });
  }
};
