const nodemailer = require("nodemailer");
const { sendSuccess, sendError } = require("../utils/ApiResponse");
const { redis } = require("../config/upstash");
const twilio = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);
const crypto = require("crypto");

const OTP_TTL = 300;

// const otpStore = new Map();
// const generateOTP = () =>
//   Math.floor(100000 + Math.random() * 900000).toString();

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.MAIL_USER,
//     pass: process.env.MAIL_PASS,
//   },
//   tls: {
//     rejectUnauthorized: false,
//   },
// });

// exports.sendOtp = async (req, res) => {
//   try {
//     const { email } = req.body;

//     if (!email) {
//       return sendError(res, "Email Reuired", 400);
//     }
//     const otp = generateOTP();
//     const expiry = Date.now() + 1 * 60 * 1000;
//     const user = otpStore.get(email);
//     if (user) {
//       otpStore.delete(email);
//     }
//     otpStore.set(email, { otp, expiry });
//     await transporter.sendMail({
//       from: process.env.MAIL_USER,
//       to: email,
//       subject: "Your OTP Code",
//       text: `Your OTP code is ${otp}. It will expire in 1 minutes.`,
//     });

//     return sendSuccess(res, "Otp sent to User", 200);
//   } catch (error) {
//     return sendError(res, "Internal server Error", 500, {
//       error: error.message,
//     });
//   }
// };

// exports.verifyOtp = async (req, res) => {
//   try {
//     const { email, otp } = req.body;

//     if (!email || !otp) {
//       return sendError(res, "Missing required Credentials", 400);
//     }
//     const saved = otpStore.get(email);

//     if (!saved) {
//       return sendError(res, "No Otp found for this email", 400);
//     }

//     if (Date.now() > saved.expiry) {
//       otpStore.delete(email);
//       return sendError(res, "Otp has expired", 400);
//     }

//     if (saved.otp !== otp) {
//       return sendError(res, "Invalid otp", 400);
//     }

//     otpStore.delete(email);
//     return sendSuccess(res, "Otp verfied Successfully", 200);
//   } catch (error) {
//     return sendError(res, "Internal server Error", 500, {
//       error: error.message,
//     });
//   }
// };

exports.sendSms = async (req, res) => {
  try {
    const { phone } = req.body;
    const senderPhone = "+91" + phone;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const key = `otp:${phone}`;
    const isOtpExistes = await redis.get(key)
    if(isOtpExistes)
    {
      await redis.del(key)
    }
    await twilio.messages.create({
      body : `OTP to Login Laridae: ${otp}`,
      from: '+19564742640',
      to: senderPhone
    })
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
    await redis.set(key, hashedOtp, {
      ex: OTP_TTL,
    });
    return sendSuccess(res, "Otp Sent Successfully", 200);
  } catch (error) {
    return sendError(res, "Internal server Error", 500, {
      error: error.message,
    });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const key = `otp:${phone}`;
    const getHashedotp = await redis.get(key);

    if (!getHashedotp) {
      return sendError(res, "OTP expired", 400);
    }

    if(crypto.createHash("sha256").update(otp).digest("hex") !== getHashedotp)
    {
      return sendError(res, "Invalid OTP", 400);
    }

    await redis.del(key)
    return sendSuccess(res, "Otp verfied Successfully", 200)
  } catch (error) {
    return sendError(res, "Internal server Error", 500, {
      error: error.message,
    });
  }
};
