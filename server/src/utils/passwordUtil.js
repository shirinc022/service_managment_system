const bcrypt=require('bcryptjs')


const hashpassword=async(password)=>{
    const salt=await bcrypt.genSalt(10)
    const hashedpassword=await bcrypt.hash(password,salt)
    return hashedpassword
}
 const comparePassword=async(password,hashpassword)=>{
    const passwordMatch=await bcrypt.compare(password,hashpassword)
    return passwordMatch
 }


module.exports={hashpassword,comparePassword}