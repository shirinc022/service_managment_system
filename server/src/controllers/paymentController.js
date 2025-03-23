const Stripe=require('stripe');
const orderModel = require('../models/orderModel');
const billModel = require('../models/billModel');
require('dotenv').config()


const stripe = new Stripe(process.env.STRIPE_SECRET)
    console.log('Stripe Secret:', process.env.STRIPE_SECRET);


const paymentFunction = async (req,res)=>{
   try{
    const {orderId,amount,billId} = req.body
    console.log(req.body)

    const lineItems=[{
        price_data: {
            currency: "inr",
            product_data: {
              name: `Payment for Order #${orderId}`,
            },
            unit_amount:Math.round(amount * 100),
        },
        quantity: 1
    }]
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url:`${process.env.FRONTEND_URL}/payment/success`,
        cancel_url:`${process.env.FRONTEND_URL}/payment/failed`,
        metadata: { 
            orderId: orderId, 
            billId: billId 
        }
    })
    
    res.status(200).json({success:true,sessionId:session.id})

   } catch(error){
    console.log(error);
    res.status(error.status || 500).json({error:error.message || "internal server error"})
}

}



// const paymentDone =async (req,res)=>{
//     try{

//         const {orderId} = req.params
//         const customerId= req.customer

//     }catch(error){
//     console.log(error);
//     res.status(error.status || 500).json({error:error.message || "internal server error"})
// }
// }





const paymentWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature']; // Get the Stripe signature

    try {
        const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

        // Check if event is a successful payment
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const orderId = session.metadata.orderId; // Get order ID from metadata

            // Update the Order model's paymentStatus to "Paid"
            await orderModel.findByIdAndUpdate(orderId, { paymentStatus: "Paid" });

            // Update the Bill model's paymentStatus to "Paid"
            await billModel.findOneAndUpdate({ order_id: orderId }, { payment: "Paid" });

            console.log(`✅ Order ${orderId} marked as Paid!`);
        }

        res.status(200).send('Webhook received');
    } catch (err) {
        console.error('Error verifying webhook:', err);
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
};






module.exports = {paymentFunction, paymentWebhook}



