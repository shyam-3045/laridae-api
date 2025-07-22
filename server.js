const express = require("express")
const app=express()
const cors=require("cors")
const dotenv=require("dotenv")
const ConnectDb = require("./config/DbConnection")
const fileUpload = require("express-fileupload")
dotenv.config()

const PORT =  process.env.PORT||5000

app.use(fileUpload({ useTempFiles: true }));
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())

ConnectDb()

app.use("/api",require("./routes/auth"))
app.use("/api",require("./routes/cart"))
app.use("/api",require("./routes/orders"))
app.use("/api",require("./routes/product"))
app.use("/api",require("./routes/userInfo"))
app.use("/api",require("./routes/otp"))

app.listen(PORT,()=>
{
    console.log(`Server is running at http://localhost:${PORT}`)
})
