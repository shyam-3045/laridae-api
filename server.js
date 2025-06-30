const express = require("express")
const app=express()
const cors=require("cors")
const dotenv=require("dotenv")
const ConnectDb = require("./config/DbConnection")
dotenv.config()

const PORT =  process.env.PORT||5000

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())

ConnectDb()

app.get("/",(req,res)=>
{
    res.send("Api working")
})
app.listen(PORT,()=>
{
    console.log(`Server is running at http://localhost:${PORT}`)
})