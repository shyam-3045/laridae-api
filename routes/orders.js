const express=require("express")
const { getMyOrders, createOrder } = require("../controllers/orders")
const router = express.Router()

router.post("/myOrder",getMyOrders)
router.post("/createOrder",createOrder)

module.exports=router