const User = require("../models/User");

exports.userExists = async (email) => {
  return await User.findOne({ email });
};

exports.newUser = async (name, email, password) => {
  return await User.create({ name, email, password });
};
