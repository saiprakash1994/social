const express=require("express")
const app=express();
app.get("/",(req,res)=>{
    res.send("api running")
})
let port=5000;
app.listen(port,()=>{
    console.log(`server running in port ${port}`)
})