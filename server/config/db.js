const mongoose=require("mongoose");

let connectionDb=async()=>{
    try{
await mongoose.connect("mongodb://127.0.0.1:27017/social",{useNewUrlParser:true})
console.log("connected to data base")
    }catch(error){
        console.error(error.message) 
        process.exit(1);
    }
}
module.exports=connectionDb;