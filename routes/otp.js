const express=require("express")
const { sendOtp, verifyOtp, sendSms } = require("../controllers/otp")
const router=express.Router()

router.post("/send-otp",sendSms)
router.post("/verify-otp",verifyOtp)

module.exports=router