const mongoose = require('mongoose');


const customerSchema=new mongoose.Schema({
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        phone: { type: Number},
        isVerified: {type: Boolean,default:false}, 
        verificationToken:{ type:String},
        role:{type:String,required:true,default:"customer"}
    }, { timestamps: true });

   


module.exports=mongoose.model('Customers',customerSchema)    