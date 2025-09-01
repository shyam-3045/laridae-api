const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { userExists, newUser } = require("../services/auth");
const { sendError, sendSuccess } = require("../utils/ApiResponse");

exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, "Email and Password are required", 400);
    }

    const user = await userExists(email);
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
    const { name, email, password } = req.body;

    if (!email || !password || !name) {
      return sendError(res, "All fields are required", 400);
    }

    const user = await userExists(email);
    if (user) {
      return sendError(res, "User already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = await newUser(name, email, hashedPassword);

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

