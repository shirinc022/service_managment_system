const Stripe = require("stripe");
const orderModel = require("../models/orderModel");
const billModel = require("../models/billModel");
require("dotenv").config();

const stripe = new Stripe(process.env.STRIPE_SECRET);

const paymentFunction = async (req, res) => {
  try {
    const { orderId, amount, billId } = req.body;
    console.log("Payment Request Body:", req.body);

    const lineItems = [
      {
        price_data: {
          currency: "inr",
          product_data: { name: `Payment for Order #${orderId}` },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/payment/success`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/failed`,
      metadata: {
        orderId: String(orderId),
        billId: String(billId),
      }, // Passing metadata for webhook
    });
    console.log("✅ Stripe Session Created:", session);

    res.status(200).json({ success: true, sessionId: session.id });
  } catch (error) {
    console.error("Payment Error:", error);
    res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
};

const paymentWebhook = async (req, res) => {
  // const event = JSON.parse(req.body);
  // console.log(req.body)
  // console.log(event.type);
  // console.log(event.data.object);
  // console.log(event.data.object.metadata.orderId);

  // signature verification
  const payload = req.body;
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret, {
      tolerance: 300,
    });

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      console.log("Payment Success Event!", session);

      // ✅ Extract metadata correctly
      let orderId = session.metadata?.orderId;
      let billId = session.metadata?.billId;

      console.log(`🔹 Extracted Order ID: ${orderId}, Bill ID: ${billId}`);

      if (!orderId || !billId) {
        console.error("Missing orderId or billId in metadata");
        return res.status(400).send("Missing orderId or billId");
      }

      // ✅ Update Database
      const updatedOrder = await orderModel.findByIdAndUpdate(
        orderId,
        { payment: "Paid" },
        { new: true }
      );
      const updatedBill = await billModel.findByIdAndUpdate(
        billId,
        { paymentStatus: "Paid" },
        { new: true }
      );

      console.log(`Order ${orderId} & Bill ${billId} marked as Paid!`);
      console.log("Updated Order:", updatedOrder);
      console.log("Updated Bill:", updatedBill);
    }
  } catch (error) {
    console.log(error.message);
    res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
    return;
  }

  console.log(req.body);
  console.log(event.type);
  console.log(event.data.object);

  res.json({ received: true });
};

module.exports = { paymentFunction, paymentWebhook };
