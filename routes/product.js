const express=require("express")
const { addProduct, getAllProducts } = require("../controllers/product")
const router=express.Router()

router.post("/addProducts",addProduct)
router.get("/getProducts",getAllProducts)

module.exports=router