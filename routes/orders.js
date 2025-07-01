const express=require("express")
const { isAuthenticated } = require("../middleware/authMiddleware")
const { getMyOrders } = require("../controllers/orders")
const router = express.Router()

router.get("/myOrder",isAuthenticated,getMyOrders)

module.exports=router