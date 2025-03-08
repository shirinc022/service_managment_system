const jwt=require('jsonwebtoken')

const authCustomer = async (req,res,next)=>{
    // console.log(req.cookies)
    try{
        const {customer_token}=req.cookies;
        // console.log(req.cookies)
        if(!customer_token){
            return  res.status(401).json({error:"jwt token not found"})
        }
        const verifiedToken = jwt.verify(customer_token,process.env.JWT_SECRETKEY)
        // console.log(verifiedToken)
        if(!verifiedToken){
            return  res.status(401).json({error:"Customer not authorised"})
        }
        if(verifiedToken.role !== "customer"){
            return  res.status(401).json({error:"access denied, only registered customer have access"})
        }
        req.customer = verifiedToken.id
        next()

    }catch(error){
        console.log(error);
        res.status(error.status || 401).json({error:error.message || "Customer authorisation failed"})
    }
}

module.exports = authCustomer