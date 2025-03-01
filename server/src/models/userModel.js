const mongoose = require('mongoose');


const userSchema=new mongoose.Schema({
        username: { type: String, required: true,unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        phone: { type: Number, required: false },
        role:{type:String,required:true,default:"customer"}
    },{timestamps:true});



module.exports=mongoose.model('Users',userSchema)    