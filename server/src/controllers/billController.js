const billModel = require("../models/billModel");
const orderModel = require("../models/orderModel");
const serviceModel = require("../models/serviceModel");


const createBill =async(req,res)=>{
    try{
        const {orderId} =req.params
        const {materialCost,extraCharges,description} =req.body;
        const provider_id = req.provider
        console.log("provider_id",provider_id);
        console.log(req.body);
        console.log("orderId",orderId)

        const existingBill = await billModel.findOne({ order_id: orderId });
    if (existingBill) {
      return res.status(400).json({ error: "Bill already exists for this order" });
    }
        
        
        const order=await orderModel.findById(orderId).populate("service_id")
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
          }

          const service = await serviceModel.findById(order.service_id);
          if (!service) {
            return res.status(404).json({ error: "Service not found" });
          }
          console.log(service)
          if(!order.status==="Completed"){
            return res.status(404).json({ error: "Bill is generted after completeing the service" });
          }
          const basicAmount = service.price; 
          const totalPrice = Number(basicAmount) + Number(materialCost) + Number(extraCharges);

          const newBill = new billModel({
            order_id:orderId,
            provider_id:provider_id,
            customer_id: order.customer_id,
            service_id: service._id,
            basicAmount, // Set from Service model
            materialCost,
            extraCharges,
            description,
            totalPrice,
          });
      
          await newBill.save();
          res.status(201).json({message: "Bill created successfully", bill: newBill });
        


    } catch (error) {
    console.log(error);
    res
      .status(error.status || 500)
      .json({ error: error.message || "internal server error" });
  }
}


const getBillByOrder = async (req,res)=>{
  try {
    const { orderId } = req.params;

    // Find the bill associated with the given order ID
    const bill = await billModel.findOne({ order_id:orderId });

    if (!bill) {
      return res.status(404).json({ success: false, message: "Bill not found for this order" });
    }

    res.status(200).json({ success: true, bill });
  } catch (error) {
    console.log(error);
    res
      .status(error.status || 500)
      .json({ error: error.message || "internal server error" });
  }
}



module.exports={createBill,getBillByOrder}






