const express=require("express")
const { isAuthenticated } = require("../middleware/authMiddleware")
const { cart } = require("../controllers/cart")
const router = express.Router()

router.get("/cart",isAuthenticated,cart)

module.exports=router