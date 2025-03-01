const mongoose = require('mongoose');


const orderSchema=new mongoose.Schema({
        service_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Services', required: true},
        customer_id: {  type: mongoose.Schema.Types.ObjectId, ref: 'Customers', required: true},
        Provider_id: {  type: mongoose.Schema.Types.ObjectId, ref: 'Providers', required: true},
        title: { type: String, required: true},
        price: {type:String,required:true},
        status:{type:Boolean,default:false},
        payment:{type:String,required:true}
    },{timestamps:true});



module.exports=mongoose.model('Orders',orderSchema)    