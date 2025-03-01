const mongoose = require('mongoose');


const messageSchema=new mongoose.Schema({
        order_id:{ type: mongoose.Schema.Types.ObjectId, ref: 'Orders',required:true},
        provider_id: {  type: mongoose.Schema.Types.ObjectId, ref: 'Services', required: true},
        customer_id: {  type: mongoose.Schema.Types.ObjectId, ref: 'Customers', required: true},
        message: { type: String, required: true },
        
    },{timestamps:true});



module.exports=mongoose.model('Messages',messageSchema)    