const mongoose=require('mongoose')
require('dotenv').config()

const connectDB=async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log(`server connected to ${process.env.MONGO_URI}`)
    }
    catch(error){
        console.log("database not connected"+error.message)
    }
}
module.exports=connectDB