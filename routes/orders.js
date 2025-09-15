const express=require("express")
const { getMyOrders, createOrder, getAllOrders, updateOrder } = require("../controllers/orders")
const router = express.Router()

router.post("/myOrder",getMyOrders)
router.post("/createOrder",createOrder)
router.get("/allorders",getAllOrders)
router.post("/updateOrder",updateOrder)

module.exports=router