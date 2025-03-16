const jwt=require('jsonwebtoken')

const authAdmin = async (req,res,next)=>{
    try{
        const {admin_token}=req.cookies;
        console.log(admin_token)
        if(!admin_token){
            return  res.status(401).json({error:"jwt token not found"})
        }
        const verifiedToken = jwt.verify(admin_token,process.env.JWT_SECRETKEY)
        if(!verifiedToken){
            return  res.status(401).json({error:"admin not authorised"})
        }
        if(verifiedToken.role !== "admin"){
            return  res.status(401).json({error:"access denied"})
        }
        req.admin = verifiedToken.id
        next()

    }catch(error){
        console.log(error);
        res.status(error.status || 401).json({error:error.message || "admin authorisation failed"})
    }
}

module.exports = authAdmin

