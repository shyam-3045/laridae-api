const express=require("express")
const { addProduct, getAllProducts, addproductImage,deleteProduct, editProducts } = require("../controllers/product")
const router=express.Router()

router.post("/addProducts",addProduct)
router.get("/getProducts",getAllProducts)
router.post("/addproductImage",addproductImage)

router.delete("/delectProduct",deleteProduct)
router.post("/editProducts/:id",editProducts)

module.exports=router