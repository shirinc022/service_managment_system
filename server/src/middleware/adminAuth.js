const jwt=require('jsonwebtoken')

const authAdmin = async (req,res,next)=>{
    try{
        const {Admin_token}=req.cookies;
        console.log(req.cookies)
        if(!Admin_token){
            return  res.status(401).json({error:"jwt token not found"})
        }
        const verifiedToken = jwt.verify(Admin_token,process.env.JWT_SECRETKEY)
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

