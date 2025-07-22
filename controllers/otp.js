const nodemailer = require("nodemailer");
const { sendSuccess, sendError } = require("../utils/ApiResponse");

const otpStore = new Map();
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return sendError(res, "Email Reuired", 400);
    }
    const otp = generateOTP();
    const expiry = Date.now() + 1 * 60 * 1000;
    const user = otpStore.get(email);
    if (user) {
    otpStore.delete(email)}
    otpStore.set(email, { otp, expiry });
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
    });

    return sendSuccess(res, "Otp sent to User", 200);
  } catch (error) {
    return sendError(res, "Internal server Error", 500, {
      error: error.message,
    });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return sendError(res, "Missing required Credentials", 400);
    }
    const saved = otpStore.get(email);
    console.log(saved);
    if (!saved) {
      return sendError(res, "No Otp found for this email", 400);
    }

    if (Date.now() > saved.expiry) {
      otpStore.delete(email);
      return sendError(res, "Otp has expired", 400);
    }

    if (saved.otp !== otp) {
      return sendError(res, "Invalid otp", 400);
    }

    otpStore.delete(email);
    return sendSuccess(res, "Otp verfied Successfully", 200);
  } catch (error) {}
};
