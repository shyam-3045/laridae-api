const express=require("express")
const { addUserDetails } = require("../controllers/userInfo")
const router=express.Router()

router.post('/addUserDet',addUserDetails)

module.exports=router