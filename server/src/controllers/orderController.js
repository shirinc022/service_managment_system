const orderModel = require("../models/orderModel");
const serviceModel = require("../models/serviceModel");

// to place order for the service by the customer
const placeOrder=async(req,res)=>{
    try{
        const {customer_name,customer_phone,customer_address,customer_location}=req.body
        if (!customer_name || !customer_phone || !customer_address || !customer_location) {
            return res.status(400).json({ error: "All customer details (name, phone, address, location) are required" });
          }
      const customerId =req.customer
      if (!customerId) {
        return res.status(400).json({ error: "Customer should login before placing order" });
      }
      const { serviceId } = req.params;
     

      
      const service = await serviceModel.findById(serviceId);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      providerId=service.provider_id
      if (!providerId) {
        return res.status(400).json({ error: "Provider ID is missing in service" });
      }
  
      const existingOrder = await orderModel.findOne({
        customer_id: customerId,
        service_id: serviceId,
        Provider_id: providerId,
        
        status: 'Pending', // Check only pending requests
      });
      if (existingOrder) {
        return res.status(400).json({ error: "You already have a pending request for this service" });
      }
  
     const Order = new orderModel({
      customer_id:customerId,
      service_id:serviceId,
      Provider_id:providerId,
      title:service.title,
      price: service.price, // Ensure price exists in Service model
      customer_name,customer_phone,customer_address,customer_location,
      payment: "pending"
  
    })
    await Order.save()
    res.status(200).json({ message: "Order placed successfully" ,Order});
  
  
      
  
    }catch(error){
          console.log(error);
          res.status(error.status || 500).json({error:error.message || "internal server error"})
      }
  }

  // to get all order request in provider dashboard

const getOrders = async (req,res)=>{
    try{
      const providerId = req.provider;
      if (!providerId) {
              return res.status(400).json({ error: "Provider ID is required" });
            }
  
            const orders = await orderModel.find({ Provider_id: providerId }).populate("customer_id service_id");
            if (!orders.length) {
                   return res.status(404).json({ message: "No orders found for this provider" });
                 }
  
                 res.status(200).json({ success: true, orders });
  
    }catch (error) {
      console.log(error);
      res
        .status(error.status || 500)
        .json({ error: error.message || "internal server error" });
    }
  }

  // provider can accept the order if they are available

  const acceptOrder =async(req,res)=>{
    try{
        const {orderId}=req.params
        console.log(orderId)
        const providerId=req.provider
        const order=await orderModel.findById(orderId)
        if(!order){
            return res.status(404).json({message:"Order not found"})
        }
        console.log(order)
        if(order.Provider_id.toString() !== providerId){
            return res.status(403).json({message:"You are not authorized to accept this order"})
        }
        order.status="Accepted"
        await order.save()
        res.status(200).json({message:"Order accepted successfully",order})

    }catch (error) {
      console.log(error);
      res
        .status(error.status || 500)
        .json({ error: error.message || "internal server error" });
    }
  }

  // provider can reject the order if they are not avilable or location is not suitable
  const rejectOrder =async(req,res)=>{
    try{
        const {orderId}=req.params
        console.log(orderId)
        const providerId=req.provider
        const order=await orderModel.findById(orderId)
        if(!order){
            return res.status(404).json({message:"Order not found"})
        }
        if(order.Provider_id.toString() !== providerId){
            return res.status(403).json({message:"You are not authorized to accept this order"})
        }
        order.status="Rejected"
        await order.save()
        res.status(200).json({message:"Order Rejected",order})

    }catch (error) {
      console.log(error);
      res
        .status(error.status || 500)
        .json({ error: error.message || "internal server error" });
    }
  }

   //provider mark order as completed once done with it

   const completedOrder=async(req,res)=>{
    try{
        const {orderId}=req.params
        console.log(orderId)
        const providerId=req.provider
        const order=await orderModel.findById(orderId)
        if(!order){
            return res.status(404).json({message:"Order not found"})
        }
        if(order.Provider_id.toString() !== providerId){
            return res.status(403).json({message:"You are not authorized to accept this order"})
        }
        order.status="Completed"
        await order.save()
        res.status(200).json({message:"Order Completed",order})
        

    }catch (error) {
      console.log(error);
      res
        .status(error.status || 500)
        .json({ error: error.message || "internal server error" });
    }
  }

//to display all orders in customer dashboard and see the status
  const customerOrderView= async (req,res)=>{
    try{
        const customerId=req.customer
        if (!customerId) {
            return res.status(401).json({ error: "Unauthorized: Please log in to view your requests" });
          }
          const orders = await orderModel.find({customer_id:customerId}) 
          .populate("service_id Provider_id", "title price")
          .select("status payment createdAt");
          if (!orders.length) {
            return res.status(404).json({ message: "No service requests found" });
          }
          res.status(200).json(orders);

    }catch (error) {
      console.log(error);
      res
        .status(error.status || 500)
        .json({ error: error.message || "internal server error" });
    }
  }

  // to delete the order if order is still in pending status
  const deleteOrder = async (req,res)=>{
    try{
        const {orderId}=req.params
        const customerId=req.customer
        if (!customerId) {
            return res.status(401).json({ error: "Unauthorized: Please log in to delete orders" });
          }
          const order = await orderModel.findOne({ _id: orderId, customer_id: customerId });

          if (!order) {
            return res.status(404).json({ error: "Order not found" });
          }
          if (order.status !== "pending") {
            return res.status(400).json({ error: "Only pending orders can be deleted" });
          }
          await orderModel.deleteOne({ _id: orderId });
          res.status(200).json({ message: "Order deleted successfully" });

    }catch (error) {
      console.log(error);
      res
        .status(error.status || 500)
        .json({ error: error.message || "internal server error" });
    }
  }

 


  module.exports = {
    getOrders,
    placeOrder,
    acceptOrder,
    rejectOrder,
    customerOrderView,
    deleteOrder,
    completedOrder
  };