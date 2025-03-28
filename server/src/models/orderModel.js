const mongoose = require('mongoose');


const orderSchema=new mongoose.Schema({
        service_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Services', required: true},
        customer_id: {  type: mongoose.Schema.Types.ObjectId, ref: 'Customers', required: true},
        Provider_id: {  type: mongoose.Schema.Types.ObjectId, ref: 'Providers', required: true},
        order_date: { type: Date, default: Date.now },
        customer_name:{type: String, required: true},
        customer_phone:{type: String, required: true},
        customer_address:{type: String, required: true},
        customer_location:{type: String, required: true},
        title: { type: String, required: true},
        price: {type:Number,required:true},
        billStatus:{type:String, enum:['Bill not send', 'Bill sent'], default :'Bill not send'},
        status: { type: String, enum: ['Pending', 'Accepted', 'Rejected','Completed'], default: 'Pending' },
        payment:{type:String, enum:['Paid', 'Pending'], default :'Pending'},
        reviewStatus:{type:String, enum:['Reviewed', 'Pending'], default :'Pending'}

    },{timestamps:true});



module.exports=mongoose.model('Orders',orderSchema)    