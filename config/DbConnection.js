const mongoose=require("mongoose")

const ConnectDb=async()=>
{
    await mongoose.connect(process.env.MONGO_URL)
    .then(()=>console.log("Connect to DB !!"))
    .catch((error)=>console.error("Not Connected error:",error))
}

module.exports=ConnectDb