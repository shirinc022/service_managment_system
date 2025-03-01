const mongoose = require('mongoose');


const providerSchema=new mongoose.Schema({
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        phone: { type: Number, required: true },
        document:{type:String,required: true},
        role:{type:String,required:true,default:"provider"},
        verification_status:{type:Boolean,default:"false"}
    },{timestamps:true});



module.exports=mongoose.model('Providers',providerSchema)    