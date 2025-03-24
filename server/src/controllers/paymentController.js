const Stripe = require('stripe');
const orderModel = require('../models/orderModel');
const billModel = require('../models/billModel');
require('dotenv').config();
const mongoose = require("mongoose");

const stripe = new Stripe(process.env.STRIPE_SECRET);

const paymentFunction = async (req, res) => {
  try {
    const { orderId, amount, billId } = req.body;
    console.log("Payment Request Body:", req.body);

    const lineItems = [{
      price_data: {
        currency: "inr",
        product_data: { name: `Payment for Order #${orderId}` },
        unit_amount: Math.round(amount * 100),
      },
      quantity: 1
    }];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/payment/success`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/failed`,
      metadata: { orderId, billId } // Passing metadata for webhook
    });

    res.status(200).json({ success: true, sessionId: session.id });
  } catch (error) {
    console.error("Payment Error:", error);
    res.status(error.status || 500).json({ error: error.message || "Internal server error" });
  }
};



const paymentWebhook = async (req, res) => {
  console.log("✅ Webhook received");

  let event;
  try {
      if (process.env.NODE_ENV === 'development') {
          console.log("⚠️ Skipping Stripe signature verification in development mode.");

          // ✅ Convert Buffer to JSON in development
          const rawBody = req.body.toString();
          event = JSON.parse(rawBody);
      } else {
          const sig = req.headers['stripe-signature'];
          event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
      }

      console.log("🔹 Full Event:", JSON.stringify(event, null, 2)); // Check event structure

      if (event.type === 'checkout.session.completed') {
          const session = event.data.object;
          console.log("🎉 Payment Success Event!", session);

          // ✅ Extract metadata correctly
          let orderId = session.metadata?.orderId;
          let billId = session.metadata?.billId;

          console.log(`🔹 Extracted Order ID: ${orderId}, Bill ID: ${billId}`);

          if (!orderId || !billId) {
              console.error("❌ Missing orderId or billId in metadata");
              return res.status(400).send("Missing orderId or billId");
          }

       

          // ✅ Update Database
          const updatedOrder = await orderModel.findByIdAndUpdate(orderId,{ payment: "Paid" }, { new: true } );
          const updatedBill = await billModel.findByIdAndUpdate(billId, { paymentStatus: "Paid" }, { new: true });

          console.log(`✅ Order ${orderId} & Bill ${billId} marked as Paid!`);
          console.log("🔹 Updated Order:", updatedOrder);
          console.log("🔹 Updated Bill:", updatedBill);
      }

      res.status(200).send('Webhook received');
  } catch (err) {
      console.error('❌ Webhook verification error:', err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
  }
};


  
module.exports = { paymentFunction, paymentWebhook };
