const mongoose = require('mongoose');


const customerSchema=new mongoose.Schema({
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role:{type:String,required:true,default:"customer"}
    });



module.exports=mongoose.model('Customers',customerSchema)    