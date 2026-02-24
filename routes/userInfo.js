const express=require("express")
const { addUserDetails, editUserDetails, getUserDetails, getAlluserdetails } = require("../controllers/userInfo")
const router=express.Router()

router.post('/addUserDet',addUserDetails)
router.post('/editUserDet',editUserDetails)
router.post('/getUserDet',getUserDetails)
router.get("/getAlluserDet",getAlluserdetails)

module.exports=router