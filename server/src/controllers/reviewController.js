const orderModel = require("../models/orderModel");
const reviewModel = require("../models/reviewModel");
const serviceModel = require("../models/serviceModel");

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
    const updatedOrder = await orderModel.findByIdAndUpdate(
            orderId,
            { reviewStatus: "Reviewed" },
            { new: true } 
          );
    res.status(201).json({ message: "Review submitted successfully", review: newReview, oder: updatedOrder});




    } catch (error) {
    console.log(error);
    res.status(error.status || 500).json({ error: error.message || "internal server error" });
  }
}


const viewCustomerReview = async (req, res) => {
  try {
    const customerId = req.customer;

    // Fetch all reviews for the particular customer
    const reviews = await reviewModel.find({ customer_id: customerId }).populate('service_id');

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found for this customer" });
    }

    res.status(200).json(reviews);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};



const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params; // Review ID from request params
    const customerId = req.customer; // Customer ID from authentication
    const { star, description } = req.body; // New review data

    // Find the review to check if it belongs to the customer
    const review = await reviewModel.findOne({ _id: reviewId, customer_id: customerId });

    if (!review) {
      return res.status(404).json({ message: "Review not found or unauthorized access" });
    }

    // Update review details
    review.star = star || review.star;
    review.description = description || review.description;
    await review.save();

    res.status(200).json({ message: "Review updated successfully", review });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const customerId = req.customer;

    // Find the review
    const review = await reviewModel.findOne({ _id: reviewId, customer_id: customerId });
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Delete the review
    await reviewModel.findByIdAndDelete(reviewId);

    // Update the order to mark it as "Not Reviewed" (if needed)
    await orderModel.findByIdAndUpdate(review.order_id, { reviewStatus: "Pending" });

    res.status(200).json({ message: "Review deleted successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};


const getProviderReviews = async (req, res) => {
  try {
    const providerId = req.provider;

    // Find services offered by the provider
    const services = await serviceModel.find({ provider_id: providerId });

    if (!services.length) {
      return res.status(404).json({ message: "No services found for this provider" });
    }

    // Extract service IDs
    const serviceIds = services.map(service => service._id);

    // Fetch reviews for these services
    const reviews = await reviewModel.find({ service_id: { $in: serviceIds } }).populate("customer_id", "name email").populate("service_id");

    res.status(200).json({ message: "Reviews fetched successfully", reviews });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Listing reviews and rating for each service in detail page

const listSingleServiceReview = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const service = await serviceModel.findById(serviceId).populate("provider_id");

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Aggregate reviews for the service
    const reviews = await reviewModel.find({ service_id: serviceId }).populate("customer_id", "name");

    // Calculate average rating
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? reviews.reduce((sum, review) => sum + review.star, 0) / totalReviews
      : 0;

    res.status(200).json({
      service,
      totalReviews,
      averageRating: averageRating.toFixed(1),
      reviews,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
   


const viewAllReviewsForAdmin = async (req, res) => {
  try {
    const reviews = await reviewModel
      .find({})
      .populate({
        path: "service_id",
        populate: {
          path: "provider_id",
          model: "Providers", // Replace with your actual provider model name
        },
      })
      .populate("customer_id");

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found" });
    }

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};










module.exports = {postReview,viewCustomerReview,updateReview,deleteReview,getProviderReviews,listSingleServiceReview, viewAllReviewsForAdmin}