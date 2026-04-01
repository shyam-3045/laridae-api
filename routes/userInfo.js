const express=require("express")
const { addUserDetails, editUserDetails, getUserDetails, getAlluserdetails, getUserOrders } = require("../controllers/userInfo")
const router=express.Router()

router.post('/addUserDet',addUserDetails)
router.post('/editUserDet',editUserDetails)
router.post('/getUserDet',getUserDetails)
router.get("/getAlluserDet",getAlluserdetails)
router.post('/getUserOrders/:userId',getUserOrders)


module.exports=router