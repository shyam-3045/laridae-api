const express=require("express")
const { addUserDetails, editUserDetails, getUserDetails } = require("../controllers/userInfo")
const router=express.Router()

router.post('/addUserDet',addUserDetails)
router.post('/editUserDet',editUserDetails)
router.post('/getUserDet',getUserDetails)

module.exports=router