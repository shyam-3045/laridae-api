const User = require("../models/User");

exports.userExists = async (phone) => {
  return await User.findOne({ phone });
};

exports.newUser = async (name, phone, password) => {
  return await User.create({ name, phone, password });
};
