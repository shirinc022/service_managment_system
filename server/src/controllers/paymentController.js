const Stripe = require('stripe');
const orderModel = require('../models/orderModel');
const billModel = require('../models/billModel');
require('dotenv').config();

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
  const sig = req.headers['stripe-signature']; // Get Stripe's signature

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const orderId = session.metadata.orderId;
      const billId = session.metadata.billId;

      console.log(`✅ Payment received for Order: ${orderId}, Bill: ${billId}`);

      if (!orderId || !billId) {
        console.error("❌ Missing orderId or billId in metadata");
        return res.status(400).send("Missing orderId or billId");
      }

      // Update Order Model
      const updatedOrder = await orderModel.findByIdAndUpdate(orderId, { paymentStatus: "Paid" }, { new: true });
      if (!updatedOrder) {
        console.error(`❌ Order ${orderId} not found`);
        return res.status(404).send(`Order ${orderId} not found`);
      }

      // Update Bill Model
      const updatedBill = await billModel.findByIdAndUpdate(billId, { payment: "Paid" }, { new: true });
      if (!updatedBill) {
        console.error(`❌ Bill ${billId} not found`);
        return res.status(404).send(`Bill ${billId} not found`);
      }

      console.log(`✅ Order ${orderId} & Bill ${billId} marked as Paid!`);
    }

    res.status(200).send('Webhook received');
  } catch (err) {
    console.error('❌ Webhook verification error:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};

module.exports = { paymentFunction, paymentWebhook };
