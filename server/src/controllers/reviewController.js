const postReview=async (req,res)=>{
    try{
      const {order_id}=req.params
      const {service_id,customer_id,star,description}=req.body


    } catch (error) {
    console.log(error);
    res.status(error.status || 500).json({ error: error.message || "internal server error" });
  }
}


module.exports = {postReview}