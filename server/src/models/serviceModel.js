const mongoose = require('mongoose');


const serviceSchema=new mongoose.Schema({
        provider_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Providers' ,required: true},
        title: { type: String, required: true},
        category: { type: String, required: true},
        description: { type: String, required: true },
        price: { type: Number, required: true },
        availability:{type:String,required: true},
        service_area:{type:String,required: true},
        images:{type:[String],required: true},
    },{timestamps:true});



module.exports=mongoose.model('Services',serviceSchema)    