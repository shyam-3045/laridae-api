const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { userExists, newUser } = require("../services/auth");
const { sendError, sendSuccess } = require("../utils/ApiResponse");

exports.login = async (req, res) => {
  try {

    const { phone, password } = req.body;
    console.log("req received")

    if (!phone || !password) {
      return sendError(res, "Phone and Password are required", 400);
    }

    const user = await userExists(phone);
    if (!user) {
      return sendError(res, "User does not exist", 404);
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return sendError(res, "Incorrect password", 401);
    }

    const token = jwt.sign(
      {
        name: user.name,
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    const data = {
      token,
      user,
    };

    return sendSuccess(res, "Login successful", data, 200);
  } catch (error) {
    return sendError(res, "Internal Server Error", 500, { error: error.message });
  }
};

exports.signup = async (req, res) => {
  try {
    const { name, phone, password } = req.body;

    if (!phone || !password || !name) {
      return sendError(res, "All fields are required", 400);
    }

    const user = await userExists(phone);
    if (user) {
      return sendError(res, "User already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = await newUser(name, phone, hashedPassword);

    const token = jwt.sign(
      {
        name: createdUser.name,
        id: createdUser._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    const data = {
      token,
      user: createdUser,
    };

    return sendSuccess(res, "User created successfully", data, 201);
  } catch (error) {
    console.error(error)
    return sendError(res, "Internal Server Error", 500, { error: error.message });
  }
};

