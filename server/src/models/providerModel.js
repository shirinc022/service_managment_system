const mongoose = require('mongoose');


const providerSchema=new mongoose.Schema({
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        phone: { type: Number, required: true },
        document:{type:String,required: true},
        role:{type:String,required:true,default:"provider"},
        verification_status:{type: String, enum: ['Pending', 'Verified', 'Rejected'],default:"Pending"}
    },{timestamps:true});



module.exports=mongoose.model('Providers',providerSchema)    