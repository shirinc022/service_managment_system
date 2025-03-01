const jwt=require('jsonwebtoken')
require('dotenv').config()


const maxAge = 3 *24 *60 * 60  //3days

const createToken = (id,role)=>{
 return jwt.sign({id,role},process.env.JWT_SECRETKEY,
 {expiresIn:maxAge}
)}
const createProviderToken = (id,role,verified)=>{
    return jwt.sign({id,role,verified},process.env.JWT_SECRETKEY,
    {expiresIn:maxAge}
   )}

module.exports={createToken, createProviderToken}