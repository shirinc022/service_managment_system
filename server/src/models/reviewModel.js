const mongoose = require('mongoose');


const reviewSchema=new mongoose.Schema({
        order_id:{ type: mongoose.Schema.Types.ObjectId, ref: 'Orders',required:true},
        service_id: {  type: mongoose.Schema.Types.ObjectId, ref: 'Services', required: true},
        customer_id: {  type: mongoose.Schema.Types.ObjectId, ref: 'Customers', required: true},
        star: { type: Number, required: true,enum:[1,2,3,4,5] },
        description: { type: String, required: true },
        
    },{timestamps:true});



module.exports=mongoose.model('Reviews',reviewSchema)    