const express=require("express")
const { createOrder, verifyPayement, webhook } = require("../controllers/razorPay")
const router=express.Router()

router.post("/create-order",createOrder)
router.post("/verify-payment",verifyPayement)
router.post("/webhook",webhook)

module.exports=router