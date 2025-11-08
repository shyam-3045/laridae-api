const express=require("express")
const { addProduct, getAllProducts, addproductImage } = require("../controllers/product")
const router=express.Router()

router.post("/addProducts",addProduct)
router.get("/getProducts",getAllProducts)
router.post("/addproductImage",addproductImage)

module.exports=router