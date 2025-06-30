const express = require("express")
const app=express()
const cors=require("cors")

const PORT = 5000 || process.env.PORT

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())

app.get("/",(req,res)=>
{
    res.send("Api working")
})
app.listen(PORT,()=>
{
    console.log(`Server is running at http://localhost:${PORT}`)
})