const orderModel = require("../models/orderModel");
const reviewModel = require("../models/reviewModel");

const postReview=async (req,res)=>{
    try{
      const {orderId}=req.params
      const customerId=req.customer
      const {star,description}=req.body
      
      const order = await orderModel.findOne({ _id: orderId, customer_id: customerId });
      console.log(order)

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    const existingReview = await reviewModel.findOne({ order_id:orderId, customer_id:customerId });
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this order." });
    }
    const newReview = new reviewModel({
      order_id:orderId,
      customer_id:customerId,
      service_id:order.service_id,
      star,
      description,
    });
    await newReview.save();
    res.status(201).json({ message: "Review submitted successfully", review: newReview });




    } catch (error) {
    console.log(error);
    res.status(error.status || 500).json({ error: error.message || "internal server error" });
  }
}


module.exports = {postReview}