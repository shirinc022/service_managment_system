const jwt=require('jsonwebtoken')

const authProvider = async (req,res,next)=>{
   
    try{
        const {provider_token}=req.cookies;
       
      
        if(!provider_token){
            return  res.status(401).json({error:"jwt token not found"})
        }
        const verifiedToken = jwt.verify(provider_token,process.env.JWT_SECRETKEY)
   
        if(!verifiedToken){
            return  res.status(401).json({error:"Provider not authorised"})
        }
        if(verifiedToken.role !== "provider" || !verifiedToken.verified){
            return  res.status(401).json({error:"access denied , only verified provider have access on services"})
        }
        req.provider = verifiedToken.id
        next()

    }catch(error){
        console.log(error);
        res.status(error.status || 401).json({error:error.message || "Provider authorisation failed"})
    }
}

module.exports = authProvider