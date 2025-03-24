const Stripe = require('stripe');
const orderModel = require('../models/orderModel');
const billModel = require('../models/billModel');
require('dotenv').config();

if (!process.env.STRIPE_SECRET || !process.env.STRIPE_WEBHOOK_SECRET || !process.env.FRONTEND_URL) {
  throw new Error("Missing required environment variables for Stripe integration.");
}

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
      metadata: {
        orderId: String(orderId),
        billId: String(billId)
      }
    });

    console.log("✅ Stripe Session Created:", session);
    res.status(200).json({ success: true, sessionId: session.id });
  } catch (error) {
    console.error("Payment Error:", error);
    res.status(error.status || 500).json({ error: error.message || "Internal server error" });
  }
};

const handlePaymentSuccess = async (session) => {
  const { orderId, billId } = session.metadata;

  if (!orderId || !billId) {
    throw new Error("Missing orderId or billId in metadata");
  }

  const updatedOrder = await orderModel.findByIdAndUpdate(orderId, { payment: "Paid" }, { new: true });
  const updatedBill = await billModel.findByIdAndUpdate(billId, { paymentStatus: "Paid" }, { new: true });

  if (!updatedOrder || !updatedBill) {
    throw new Error("Order or Bill not found");
  }

  console.log(`✅ Order ${orderId} & Bill ${billId} marked as Paid!`);
  console.log("🔹 Updated Order:", updatedOrder);
  console.log("🔹 Updated Bill:", updatedBill);
};

const paymentWebhook = async (req, res) => {
  console.log("✅ Webhook received");

  let event;
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log("⚠️ Skipping Stripe signature verification in development mode.");
      const rawBody = req.body.toString();
      event = JSON.parse(rawBody);
    } else {
      const sig = req.headers['stripe-signature'];
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    }

    console.log("🔹 Full Event:", JSON.stringify(event, null, 2));

    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).send('Webhook received');
  } catch (err) {
    console.error('❌ Webhook verification error:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};

module.exports = { paymentFunction, paymentWebhook };